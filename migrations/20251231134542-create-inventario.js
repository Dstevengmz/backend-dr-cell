'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inventarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      sku: {
        type: Sequelize.STRING
      },
      categoriaId: {
        type: Sequelize.BIGINT
      },
      proveedorId: {
        type: Sequelize.BIGINT
      },
      costoCompra: {
        type: Sequelize.DECIMAL
      },
      precioVenta: {
        type: Sequelize.DECIMAL
      },
      stockActual: {
        type: Sequelize.INTEGER
      },
      stockMinimo: {
        type: Sequelize.INTEGER
      },
      activo: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Inventarios');
  }
};