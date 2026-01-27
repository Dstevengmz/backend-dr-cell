'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relación con Categoria
      Inventario.belongsTo(models.Categoria, {
        foreignKey: 'categoriaId',
        as: 'categoria'
      });
      
      // Relación con Proveedor
      Inventario.belongsTo(models.Proveedor, {
        foreignKey: 'proveedorId',
        as: 'proveedor'
      });
      
      // Relación con MovimientoInventario
      Inventario.hasMany(models.MovimientoInventario, {
        foreignKey: 'inventarioId',
        as: 'movimientos'
      });
    }
  }
  Inventario.init({
    nombre: DataTypes.STRING,
    sku: DataTypes.STRING,
    categoriaId: DataTypes.BIGINT,
    proveedorId: DataTypes.BIGINT,
    costoCompra: DataTypes.DECIMAL,
    precioVenta: DataTypes.DECIMAL,
    stockActual: DataTypes.INTEGER,
    stockMinimo: DataTypes.INTEGER,
    activo: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Inventario',
  });
  return Inventario;
};