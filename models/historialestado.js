'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistorialEstado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relación con OrdenReparacion
      HistorialEstado.belongsTo(models.OrdenReparacion, {
        foreignKey: 'ordenReparacionId',
        as: 'orden'
      });
    }
  }
  HistorialEstado.init({
    ordenReparacionId: DataTypes.BIGINT,
    administradorId: DataTypes.BIGINT,
    estadoAnterior: DataTypes.STRING,
    estadoNuevo: DataTypes.STRING,
    notaPublica: DataTypes.STRING,
    notaInterna: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'HistorialEstado',
  });
  return HistorialEstado;
};