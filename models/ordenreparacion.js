'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenReparacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relación con Cliente
      OrdenReparacion.belongsTo(models.Cliente, {
        foreignKey: 'clienteId',
        as: 'cliente'
      });
      
      // Relación con HistorialEstado
      OrdenReparacion.hasMany(models.HistorialEstado, {
        foreignKey: 'ordenReparacionId',
        as: 'historialEstados'
      });
    }
  }
  OrdenReparacion.init({
    clienteId: DataTypes.BIGINT,
    administradorId: DataTypes.BIGINT,
    codigoSeguimiento: DataTypes.STRING,
    codigoHash: DataTypes.STRING,
    tipoEquipo: DataTypes.STRING,
    marca: DataTypes.STRING,
    modelo: DataTypes.STRING,
    imei: DataTypes.STRING,
    resumenFalla: DataTypes.STRING,
    detalleFalla: DataTypes.TEXT,
    estado: DataTypes.STRING,
    costoEstimado: DataTypes.DECIMAL,
    costoFinal: DataTypes.DECIMAL,
    fechaIngreso: DataTypes.DATE,
    fechaEntrega: DataTypes.DATE,
    notaInterna: DataTypes.TEXT,
    activo: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'OrdenReparacion',
  });
  return OrdenReparacion;
};