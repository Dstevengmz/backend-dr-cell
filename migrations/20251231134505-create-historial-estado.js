'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistorialEstados', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ordenReparacionId: {
        type: Sequelize.BIGINT
      },
      administradorId: {
        type: Sequelize.BIGINT
      },
      estadoAnterior: {
        type: Sequelize.STRING
      },
      estadoNuevo: {
        type: Sequelize.STRING
      },
      notaPublica: {
        type: Sequelize.STRING
      },
      notaInterna: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('HistorialEstados');
  }
};