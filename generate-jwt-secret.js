#!/usr/bin/env node

/**
 * Script para generar JWT Secret seguro
 * Uso: node generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 GENERADOR DE JWT SECRET SEGURO\n');
console.log('═'.repeat(60));

// Generar 64 bytes aleatorios y convertir a hex
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n✅ JWT Secret generado exitosamente!\n');
console.log('Copia este valor y actualiza tu archivo .env:\n');
console.log('─'.repeat(60));
console.log(`JWT_SECRET=${secret}`);
console.log('─'.repeat(60));
console.log('\n⚠️  IMPORTANTE:');
console.log('  1. Este secret debe ser DIFERENTE en desarrollo y producción');
console.log('  2. NUNCA compartas este valor públicamente');
console.log('  3. Si se compromete, genera uno nuevo inmediatamente');
console.log('  4. Guárdalo en un lugar seguro (gestor de contraseñas)\n');
console.log('═'.repeat(60));
console.log('');
