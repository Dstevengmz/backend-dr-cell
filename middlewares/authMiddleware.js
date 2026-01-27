const authService = require('../services/authService');
const { Administrador } = require('../models');

// Middleware para verificar token JWT
const verificarToken = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const decoded = authService.verifyToken(token);

    // Buscar administrador
    const administrador = await Administrador.findByPk(decoded.id, {
      attributes: { exclude: ['claveHash'] }
    });

    if (!administrador) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Agregar usuario a la request (con email normalizado)
    req.user = {
      id: administrador.id,
      nombre: administrador.nombre,
      email: administrador.correo,
      rol: administrador.rol
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

// Middleware para verificar rol de administrador
const verificarAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador'
    });
  }
  next();
};

module.exports = {
  verificarToken,
  verificarAdmin
};
