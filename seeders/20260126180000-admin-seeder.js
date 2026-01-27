require('dotenv').config();
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Verifica si ya existe el admin
    const [admin] = await queryInterface.sequelize.query(
      `SELECT * FROM Administradors WHERE correo = :correo LIMIT 1`,
      {
        replacements: { correo: adminEmail },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    if (admin) {
      console.log('ℹ️  El administrador ya existe en la base de datos');
      return;
    }
    await queryInterface.bulkInsert('Administradors', [
      {
        nombre: 'Administrador',
        correo: adminEmail,
        claveHash: passwordHash,
        rol: 'admin',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ Administrador creado con éxito');
  },

  down: async (queryInterface, Sequelize) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    await queryInterface.bulkDelete('Administradors', { correo: adminEmail });
    console.log('🗑️ Administrador eliminado');
  }
};
