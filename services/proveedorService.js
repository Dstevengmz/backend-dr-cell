const { Proveedor } = require('../models');

class ProveedorService {
  // Crear proveedor
  async crearProveedor(datos) {
    try {
      const proveedor = await Proveedor.create(datos);
      return proveedor;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los proveedores
  async obtenerProveedores() {
    try {
      const proveedores = await Proveedor.findAll({
        order: [['nombre', 'ASC']]
      });
      return proveedores;
    } catch (error) {
      throw error;
    }
  }

  // Obtener proveedor por ID
  async obtenerProveedorPorId(id) {
    try {
      const proveedor = await Proveedor.findByPk(id);
      if (!proveedor) {
        throw new Error('Proveedor no encontrado');
      }
      return proveedor;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar proveedor
  async actualizarProveedor(id, datos) {
    try {
      const proveedor = await Proveedor.findByPk(id);
      if (!proveedor) {
        throw new Error('Proveedor no encontrado');
      }
      await proveedor.update(datos);
      return proveedor;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar proveedor
  async eliminarProveedor(id) {
    try {
      const proveedor = await Proveedor.findByPk(id);
      if (!proveedor) {
        throw new Error('Proveedor no encontrado');
      }
      await proveedor.destroy();
      return { mensaje: 'Proveedor eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProveedorService();
