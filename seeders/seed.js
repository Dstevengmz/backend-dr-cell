require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // Sincronizar base de datos
    await db.sequelize.sync();

    // Verificar si ya existe un administrador
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD ;
    const adminExistente = await db.Administrador.findOne({
      where: { correo: adminEmail }
    });

    if (adminExistente) {
      console.log('ℹ️  El administrador ya existe en la base de datos');
      console.log('\n📋 Datos de acceso:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      process.exit(0);
    }

    // Crear administrador
    console.log('👤 Creando administrador...');
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.Administrador.create({
      nombre: 'Administrador',
      correo: adminEmail,
      claveHash: passwordHash,
      rol: 'admin',
      activo: true
    });
    console.log('✅ Administrador creado');

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📋 Datos de acceso:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n📝 Nota: Los demás datos (categorías, proveedores, productos, clientes y órdenes)');
    console.log('   deben ser registrados a través del panel de administración.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar seed:', error);
    process.exit(1);
  }
};

seedDatabase();
