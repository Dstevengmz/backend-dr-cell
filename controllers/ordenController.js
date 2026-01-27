const ordenService = require('../services/ordenService');

class OrdenController {
  // POST /api/ordenes - Crear nueva orden
  async crear(req, res) {
    try {
      const orden = await ordenService.crearOrden(req.body);
      res.status(201).json({
        success: true,
        data: orden,
        message: 'Orden creada exitosamente. El cliente recibirá un email con el código de seguimiento.'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/ordenes - Obtener todas las órdenes
  async obtenerTodas(req, res) {
    try {
      const filtros = {
        estado: req.query.estado,
        fechaDesde: req.query.fechaDesde,
        fechaHasta: req.query.fechaHasta
      };

      const ordenes = await ordenService.obtenerOrdenes(filtros);
      
      res.json({
        success: true,
        data: ordenes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/ordenes/:id - Obtener orden por ID
  async obtenerPorId(req, res) {
    try {
      const orden = await ordenService.obtenerOrdenPorId(req.params.id);
      
      res.json({
        success: true,
        data: orden
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/ordenes/:id - Actualizar orden
  async actualizar(req, res) {
    try {
      const orden = await ordenService.actualizarOrden(req.params.id, req.body);
      
      res.json({
        success: true,
        data: orden,
        message: 'Orden actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/ordenes/:id/estado - Actualizar estado de la orden
  async actualizarEstado(req, res) {
    try {
      const { estado, descripcion } = req.body;

      if (!estado) {
        return res.status(400).json({
          success: false,
          message: 'El estado es requerido'
        });
      }

      const orden = await ordenService.actualizarEstado(
        req.params.id,
        estado,
        descripcion
      );
      
      res.json({
        success: true,
        data: orden,
        message: 'Estado actualizado exitosamente. Se ha notificado al cliente.'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/ordenes/:id - Eliminar orden
  async eliminar(req, res) {
    try {
      const resultado = await ordenService.eliminarOrden(req.params.id);
      
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

  // POST /api/ordenes/consultar - Consultar estado (Endpoint público)
  async consultarEstado(req, res) {
    try {
      const { codigoSeguimiento } = req.body;

      if (!codigoSeguimiento) {
        return res.status(400).json({
          success: false,
          message: 'Código de seguimiento es requerido'
        });
      }

      const orden = await ordenService.consultarEstadoPorCodigo(
        codigoSeguimiento
      );
      
      res.json({
        success: true,
        data: orden
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new OrdenController();
