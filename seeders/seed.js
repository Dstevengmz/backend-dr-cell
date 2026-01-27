require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de datos...');

    // Sincronizar base de datos
    await db.sequelize.sync();

    // Verificar si ya existe un administrador
    const adminExistente = await db.Administrador.findOne({
      where: { correo: 'admin@tienda.com' }
    });

    if (adminExistente) {
      console.log('ℹ️  El administrador ya existe en la base de datos');
      console.log('\n📋 Datos de acceso:');
      console.log('   Email: admin@tienda.com');
      console.log('   Password: admin123');
      process.exit(0);
    }

    // Crear administrador
    console.log('👤 Creando administrador...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    await db.Administrador.create({
      nombre: 'Administrador',
      correo: 'admin@tienda.com',
      claveHash: passwordHash,
      rol: 'admin',
      activo: true
    });
    console.log('✅ Administrador creado');

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📋 Datos de acceso:');
    console.log('   Email: admin@tienda.com');
    console.log('   Password: admin123');
    console.log('\n📝 Nota: Los demás datos (categorías, proveedores, productos, clientes y órdenes)');
    console.log('   deben ser registrados a través del panel de administración.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar seed:', error);
    process.exit(1);
  }
};

seedDatabase();
