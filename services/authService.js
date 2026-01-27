const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Administrador } = require('../models');

class AuthService {
  // Registrar un nuevo administrador
  async register(datos) {
    try {
      const { nombre, email, password } = datos;

      // Verificar si el administrador ya existe
      const administradorExistente = await Administrador.findOne({ where: { correo: email } });
      if (administradorExistente) {
        throw new Error('El email ya está registrado');
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear administrador
      const administrador = await Administrador.create({
        nombre,
        correo: email,
        claveHash: passwordHash,
        rol: 'admin',
        activo: true
      });

      // Generar token
      const token = this.generateToken(administrador);

      return {
        administrador: {
          id: administrador.id,
          nombre: administrador.nombre,
          email: administrador.email,
          rol: administrador.rol
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Login
  async login(email, password) {
    try {
      // Buscar administrador
      const administrador = await Administrador.findOne({ where: { correo: email } });
      if (!administrador) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const esValida = await bcrypt.compare(password, administrador.claveHash);
      if (!esValida) {
        throw new Error('Credenciales inválidas');
      }

      // Generar token
      const token = this.generateToken(administrador);

      return {
        administrador: {
          id: administrador.id,
          nombre: administrador.nombre,
          email: administrador.correo,
          rol: administrador.rol
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Generar token JWT
  generateToken(administrador) {
    return jwt.sign(
      {
        id: administrador.id,
        email: administrador.correo,
        rol: administrador.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  // Verificar token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}

module.exports = new AuthService();
