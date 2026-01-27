'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proveedor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relación con Inventario
      Proveedor.hasMany(models.Inventario, {
        foreignKey: 'proveedorId',
        as: 'productos'
      });
    }
  }
  Proveedor.init({
    nombre: DataTypes.STRING,
    contacto: DataTypes.STRING,
    telefono: DataTypes.STRING,
    correo: DataTypes.STRING,
    direccion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Proveedor',
  });
  return Proveedor;
};