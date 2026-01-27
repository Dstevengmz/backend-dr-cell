const { Categoria } = require('../models');

class CategoriaService {
  // Crear categoría
  async crearCategoria(datos) {
    try {
      const categoria = await Categoria.create(datos);
      return categoria;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todas las categorías
  async obtenerCategorias() {
    try {
      const categorias = await Categoria.findAll({
        order: [['nombre', 'ASC']]
      });
      return categorias;
    } catch (error) {
      throw error;
    }
  }

  // Obtener categoría por ID
  async obtenerCategoriaPorId(id) {
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
      return categoria;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar categoría
  async actualizarCategoria(id, datos) {
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
      await categoria.update(datos);
      return categoria;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar categoría
  async eliminarCategoria(id) {
    try {
      const categoria = await Categoria.findByPk(id);
      if (!categoria) {
        throw new Error('Categoría no encontrada');
      }
      await categoria.destroy();
      return { mensaje: 'Categoría eliminada exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CategoriaService();
