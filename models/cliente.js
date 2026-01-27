'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relación con OrdenReparacion
      Cliente.hasMany(models.OrdenReparacion, {
        foreignKey: 'clienteId',
        as: 'ordenes'
      });
    }
  }
  Cliente.init({
    nombreCompleto: DataTypes.STRING,
    correo: DataTypes.STRING,
    telefono: DataTypes.STRING,
    documento: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cliente',
  });
  return Cliente;
};