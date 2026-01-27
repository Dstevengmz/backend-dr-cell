'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrdenReparacions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clienteId: {
        type: Sequelize.BIGINT
      },
      administradorId: {
        type: Sequelize.BIGINT
      },
      codigoSeguimiento: {
        type: Sequelize.STRING
      },
      codigoHash: {
        type: Sequelize.STRING
      },
      tipoEquipo: {
        type: Sequelize.STRING
      },
      marca: {
        type: Sequelize.STRING
      },
      modelo: {
        type: Sequelize.STRING
      },
      imei: {
        type: Sequelize.STRING
      },
      resumenFalla: {
        type: Sequelize.STRING
      },
      detalleFalla: {
        type: Sequelize.TEXT
      },
      estado: {
        type: Sequelize.STRING
      },
      costoEstimado: {
        type: Sequelize.DECIMAL
      },
      costoFinal: {
        type: Sequelize.DECIMAL
      },
      fechaIngreso: {
        type: Sequelize.DATE
      },
      fechaEntrega: {
        type: Sequelize.DATE
      },
      notaInterna: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('OrdenReparacions');
  }
};