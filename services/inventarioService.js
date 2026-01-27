const { Inventario, Categoria, Proveedor, MovimientoInventario } = require('../models');
const { Op } = require('sequelize');

class InventarioService {
  // Crear producto en inventario
  async crearProducto(datos) {
    try {
      // Validar que el nombre no exista
      const productoExistente = await Inventario.findOne({
        where: { nombre: datos.nombre }
      });

      if (productoExistente) {
        throw new Error('Ya existe un producto con ese nombre');
      }

      const producto = await Inventario.create(datos);

      // Registrar movimiento de entrada inicial
      if (datos.stockActual > 0) {
        await MovimientoInventario.create({
          inventarioId: producto.id,
          tipoMovimiento: 'entrada',
          cantidad: datos.stockActual,
          motivo: 'Stock inicial'
        });
      }

      return await this.obtenerProductoPorId(producto.id);
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los productos
  async obtenerProductos(filtros = {}) {
    try {
      const where = {};

      if (filtros.categoriaId) {
        where.categoriaId = filtros.categoriaId;
      }

      if (filtros.proveedorId) {
        where.proveedorId = filtros.proveedorId;
      }

      if (filtros.busqueda) {
        where[Op.or] = [
          { nombre: { [Op.like]: `%${filtros.busqueda}%` } },
          { codigo: { [Op.like]: `%${filtros.busqueda}%` } }
        ];
      }

      const productos = await Inventario.findAll({
        where,
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Proveedor, as: 'proveedor' }
        ],
        order: [['nombre', 'ASC']]
      });

      return productos;
    } catch (error) {
      throw error;
    }
  }

  // Obtener producto por ID
  async obtenerProductoPorId(id) {
    try {
      const producto = await Inventario.findByPk(id, {
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Proveedor, as: 'proveedor' },
          {
            model: MovimientoInventario,
            as: 'movimientos',
            order: [['createdAt', 'DESC']],
            limit: 10
          }
        ]
      });

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      return producto;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar producto
  async actualizarProducto(id, datos) {
    try {
      const producto = await Inventario.findByPk(id);

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      // Validar que el nombre no exista en otro producto
      if (datos.nombre && datos.nombre !== producto.nombre) {
        const productoExistente = await Inventario.findOne({
          where: { 
            nombre: datos.nombre,
            id: { [Op.ne]: id }
          }
        });

        if (productoExistente) {
          throw new Error('Ya existe otro producto con ese nombre');
        }
      }

      await producto.update(datos);

      return await this.obtenerProductoPorId(id);
    } catch (error) {
      throw error;
    }
  }

  // Eliminar producto
  async eliminarProducto(id) {
    try {
      const producto = await Inventario.findByPk(id);

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      await producto.destroy();

      return { mensaje: 'Producto eliminado exitosamente' };
    } catch (error) {
      throw error;
    }
  }

  // Registrar movimiento de inventario (entrada/salida)
  async registrarMovimiento(datos) {
    try {
      const { inventarioId, tipoMovimiento, cantidad, descripcion } = datos;

      const producto = await Inventario.findByPk(inventarioId);

      if (!producto) {
        throw new Error('Producto no encontrado');
      }

      // Calcular nuevo stock
      let nuevoStock = producto.stockActual;
      if (tipoMovimiento === 'entrada') {
        nuevoStock += cantidad;
      } else if (tipoMovimiento === 'salida') {
        nuevoStock -= cantidad;
        if (nuevoStock < 0) {
          throw new Error('Stock insuficiente');
        }
      }

      // Actualizar stock
      await producto.update({ stockActual: nuevoStock });

      // Registrar movimiento
      const movimiento = await MovimientoInventario.create({
        inventarioId,
        tipoMovimiento,
        cantidad,
        motivo: descripcion
      });

      return {
        movimiento,
        stockActual: nuevoStock
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtener productos con stock bajo
  async obtenerProductosStockBajo() {
    try {
      const { Sequelize } = require('sequelize');
      const productos = await Inventario.findAll({
        where: Sequelize.where(
          Sequelize.col('stockActual'),
          '<=',
          Sequelize.col('stockMinimo')
        ),
        include: [
          { model: Categoria, as: 'categoria' },
          { model: Proveedor, as: 'proveedor' }
        ],
        order: [['stockActual', 'ASC']]
      });

      return productos;
    } catch (error) {
      throw error;
    }
  }

  // Obtener historial de movimientos
  async obtenerMovimientos(filtros = {}) {
    try {
      const where = {};

      if (filtros.inventarioId) {
        where.inventarioId = filtros.inventarioId;
      }

      if (filtros.tipoMovimiento) {
        where.tipoMovimiento = filtros.tipoMovimiento;
      }

      if (filtros.fechaDesde) {
        where.createdAt = {
          ...where.createdAt,
          [Op.gte]: filtros.fechaDesde
        };
      }

      if (filtros.fechaHasta) {
        where.createdAt = {
          ...where.createdAt,
          [Op.lte]: filtros.fechaHasta
        };
      }

      const movimientos = await MovimientoInventario.findAll({
        where,
        include: [
          {
            model: Inventario,
            as: 'inventario',
            include: [
              { model: Categoria, as: 'categoria' }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return movimientos;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new InventarioService();
