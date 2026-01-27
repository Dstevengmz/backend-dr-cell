'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MovimientoInventario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relación con Inventario
      MovimientoInventario.belongsTo(models.Inventario, {
        foreignKey: 'inventarioId',
        as: 'inventario'
      });
    }
  }
  MovimientoInventario.init({
    inventarioId: DataTypes.BIGINT,
    tipoMovimiento: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    motivo: DataTypes.STRING,
    ordenReparacionId: DataTypes.BIGINT,
    administradorId: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'MovimientoInventario',
  });
  return MovimientoInventario;
};