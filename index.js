require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./models');

// Importar rutas
const authRoutes = require('./routers/authRoutes');
const ordenRoutes = require('./routers/ordenRoutes');
const inventarioRoutes = require('./routers/inventarioRoutes');
const categoriaRoutes = require('./routers/categoriaRoutes');
const proveedorRoutes = require('./routers/proveedorRoutes');
const productoRoutes = require('./routers/productoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar CSP para permitir imágenes de Cloudinary
  crossOriginEmbedderPolicy: false
}));

// Rate limiting - Limitar peticiones por IP
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutos por defecto
  max: parseInt(process.env.RATE_LIMIT_MAX || 100), // 100 peticiones por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar rate limiting a todas las rutas API
app.use('/api/', limiter);

// Configuración de CORS segura
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (como apps móviles o Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Tienda de Reparación de Móviles',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      ordenes: '/api/ordenes',
      inventario: '/api/inventario',
      categorias: '/api/categorias',
      proveedores: '/api/proveedores'
    }
  });
});

// Ruta para estadísticas (dashboard)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { OrdenReparacion, Inventario, Cliente, Proveedor } = require('./models');
    const { Op } = require('sequelize');

    const [
      totalOrdenes,
      ordenesActivas,
      totalClientes,
      productosStock,
      todosProductos,
      totalProveedores
    ] = await Promise.all([
      OrdenReparacion.count(),
      OrdenReparacion.count({
        where: {
          estado: {
            [Op.notIn]: ['Reparado', 'Entregado', 'Cancelado']
          }
        }
      }),
      Cliente.count(),
      Inventario.count({
        where: {
          stockActual: { [Op.gt]: 0 }
        }
      }),
      Inventario.findAll(),
      Proveedor.count()
    ]);

    // Calcular stock bajo manualmente
    const stockBajo = todosProductos.filter(p => p.stockActual <= (p.stockMinimo || 5)).length;

    res.json({
      success: true,
      data: {
        totalOrdenes,
        ordenesActivas,
        totalClientes,
        productosStock,
        stockBajo,
        totalProveedores
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  // Log del error en servidor (considera usar Winston en producción)
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  
  // No exponer detalles del error en producción
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Sincronizar base de datos y iniciar servidor
db.sequelize.authenticate()
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('✅ Conexión a la base de datos exitosa');
    }
    
    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'test') {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📚 Ambiente: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔒 CORS habilitado para: ${allowedOrigins.join(', ')}`);
      }
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    process.exit(1);
  });

module.exports = app;
