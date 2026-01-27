const proveedorService = require('../services/proveedorService');

class ProveedorController {
  // POST /api/proveedores
  async crear(req, res) {
    try {
      const proveedor = await proveedorService.crearProveedor(req.body);
      res.status(201).json({
        success: true,
        data: proveedor,
        message: 'Proveedor creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/proveedores
  async obtenerTodos(req, res) {
    try {
      const proveedores = await proveedorService.obtenerProveedores();
      res.json({
        success: true,
        data: proveedores
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/proveedores/:id
  async obtenerPorId(req, res) {
    try {
      const proveedor = await proveedorService.obtenerProveedorPorId(req.params.id);
      res.json({
        success: true,
        data: proveedor
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/proveedores/:id
  async actualizar(req, res) {
    try {
      const proveedor = await proveedorService.actualizarProveedor(req.params.id, req.body);
      res.json({
        success: true,
        data: proveedor,
        message: 'Proveedor actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/proveedores/:id
  async eliminar(req, res) {
    try {
      const resultado = await proveedorService.eliminarProveedor(req.params.id);
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
}

module.exports = new ProveedorController();
