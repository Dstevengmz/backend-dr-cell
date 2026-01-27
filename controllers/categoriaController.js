const categoriaService = require('../services/categoriaService');

class CategoriaController {
  // POST /api/categorias
  async crear(req, res) {
    try {
      const categoria = await categoriaService.crearCategoria(req.body);
      res.status(201).json({
        success: true,
        data: categoria,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/categorias
  async obtenerTodas(req, res) {
    try {
      const categorias = await categoriaService.obtenerCategorias();
      res.json({
        success: true,
        data: categorias
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/categorias/:id
  async obtenerPorId(req, res) {
    try {
      const categoria = await categoriaService.obtenerCategoriaPorId(req.params.id);
      res.json({
        success: true,
        data: categoria
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/categorias/:id
  async actualizar(req, res) {
    try {
      const categoria = await categoriaService.actualizarCategoria(req.params.id, req.body);
      res.json({
        success: true,
        data: categoria,
        message: 'Categoría actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/categorias/:id
  async eliminar(req, res) {
    try {
      const resultado = await categoriaService.eliminarCategoria(req.params.id);
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

module.exports = new CategoriaController();
