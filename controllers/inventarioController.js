const inventarioService = require('../services/inventarioService');

class InventarioController {
  // POST /api/inventario - Crear producto
  async crear(req, res) {
    try {
      const producto = await inventarioService.crearProducto(req.body);
      res.status(201).json({
        success: true,
        data: producto,
        message: 'Producto creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/inventario - Obtener todos los productos
  async obtenerTodos(req, res) {
    try {
      const filtros = {
        categoriaId: req.query.categoriaId,
        proveedorId: req.query.proveedorId,
        busqueda: req.query.busqueda
      };

      const productos = await inventarioService.obtenerProductos(filtros);
      
      res.json({
        success: true,
        data: productos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/inventario/stock-bajo - Obtener productos con stock bajo
  async obtenerStockBajo(req, res) {
    try {
      const productos = await inventarioService.obtenerProductosStockBajo();
      
      res.json({
        success: true,
        data: productos,
        count: productos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/inventario/:id - Obtener producto por ID
  async obtenerPorId(req, res) {
    try {
      const producto = await inventarioService.obtenerProductoPorId(req.params.id);
      
      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/inventario/:id - Actualizar producto
  async actualizar(req, res) {
    try {
      const producto = await inventarioService.actualizarProducto(req.params.id, req.body);
      
      res.json({
        success: true,
        data: producto,
        message: 'Producto actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/inventario/:id - Eliminar producto
  async eliminar(req, res) {
    try {
      const resultado = await inventarioService.eliminarProducto(req.params.id);
      
      res.json({
        success: true,
        message: resultado.mensaje
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/inventario/movimiento - Registrar movimiento (entrada/salida)
  async registrarMovimiento(req, res) {
    try {
      const resultado = await inventarioService.registrarMovimiento(req.body);
      
      res.json({
        success: true,
        data: resultado,
        message: 'Movimiento registrado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/inventario/movimientos - Obtener historial de movimientos
  async obtenerMovimientos(req, res) {
    try {
      const filtros = {
        inventarioId: req.query.inventarioId,
        tipoMovimiento: req.query.tipoMovimiento,
        fechaDesde: req.query.fechaDesde,
        fechaHasta: req.query.fechaHasta
      };

      const movimientos = await inventarioService.obtenerMovimientos(filtros);
      
      res.json({
        success: true,
        data: movimientos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new InventarioController();
