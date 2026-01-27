const { v4: uuidv4 } = require('uuid');
const { OrdenReparacion, Cliente, HistorialEstado } = require('../models');
const emailService = require('./emailService');

class OrdenService {
  // Crear nueva orden de reparación
  async crearOrden(datosOrden) {
    try {
      const {
        clienteNombre,
        clienteEmail,
        clienteTelefono,
        marca,
        modelo,
        imei,
        problemaReportado,
        observaciones,
        costoEstimado
      } = datosOrden;

      // Buscar o crear cliente
      let cliente = await Cliente.findOne({ where: { correo: clienteEmail } });
      
      if (!cliente) {
        cliente = await Cliente.create({
          nombreCompleto: clienteNombre,
          correo: clienteEmail,
          telefono: clienteTelefono
        });
      } else {
        // Actualizar datos del cliente si es necesario
        await cliente.update({
          nombreCompleto: clienteNombre,
          telefono: clienteTelefono
        });
      }

      // Generar código de seguimiento único
      const codigoSeguimiento = this.generarCodigoSeguimiento();

      // Crear orden de reparación
      const orden = await OrdenReparacion.create({
        clienteId: cliente.id,
        codigoSeguimiento,
        marca,
        modelo,
        imei,
        resumenFalla: problemaReportado,
        detalleFalla: observaciones,
        costoEstimado: costoEstimado || 0,
        fechaIngreso: new Date(),
        estado: 'recibido',
        activo: true
      });

      // Crear registro en historial de estados
      await HistorialEstado.create({
        ordenReparacionId: orden.id,
        estadoNuevo: 'recibido',
        notaPublica: 'Equipo recibido y registrado en el sistema'
      });

      // Enviar email al cliente con el código de seguimiento
      try {
        await emailService.enviarCodigoSeguimiento(
          clienteEmail,
          codigoSeguimiento,
          {
            nombreCliente: clienteNombre,
            marca,
            modelo,
            problemaReportado,
            fechaIngreso: orden.fechaIngreso
          }
        );
      } catch (emailError) {
        console.error('Error al enviar email:', emailError);
        // Continuamos aunque falle el email
      }

      // Obtener orden completa con relaciones
      const ordenCompleta = await OrdenReparacion.findByPk(orden.id, {
        include: [
          {
            model: Cliente,
            as: 'cliente'
          },
          {
            model: HistorialEstado,
            as: 'historialEstados',
            order: [['fecha', 'DESC']]
          }
        ]
      });

      return ordenCompleta;
    } catch (error) {
      throw error;
    }
  }

  // Generar código de seguimiento único (formato: REP-XXXXXX)
  generarCodigoSeguimiento() {
    const codigo = uuidv4().split('-')[0].toUpperCase();
    return `REP-${codigo}`;
  }

  // Obtener todas las órdenes
  async obtenerOrdenes(filtros = {}) {
    try {
      const where = {};

      if (filtros.estado) {
        where.estado = filtros.estado;
      }

      if (filtros.fechaDesde) {
        where.fechaIngreso = {
          ...where.fechaIngreso,
          [Op.gte]: filtros.fechaDesde
        };
      }

      if (filtros.fechaHasta) {
        where.fechaIngreso = {
          ...where.fechaIngreso,
          [Op.lte]: filtros.fechaHasta
        };
      }

      const ordenes = await OrdenReparacion.findAll({
        where,
        include: [
          {
            model: Cliente,
            as: 'cliente'
          }
        ],
        order: [['fechaIngreso', 'DESC']]
      });

      return ordenes;
    } catch (error) {
      throw error;
    }
  }

  // Obtener orden por ID
  async obtenerOrdenPorId(id) {
    try {
      const orden = await OrdenReparacion.findByPk(id, {
        include: [
          {
            model: Cliente,
            as: 'cliente'
          },
          {
            model: HistorialEstado,
            as: 'historialEstados',
            order: [['fecha', 'DESC']]
          }
        ]
      });

      if (!orden) {
        throw new Error('Orden no encontrada');
      }

      return orden;
    } catch (error) {
      throw error;
    }
  }

  // Consultar estado por código (Endpoint público)
  async consultarEstadoPorCodigo(codigoSeguimiento) {
    try {
      // Normalizar el código: eliminar espacios y convertir a mayúsculas
      const codigoNormalizado = codigoSeguimiento.trim().toUpperCase();
      
      const orden = await OrdenReparacion.findOne({
        where: { codigoSeguimiento: codigoNormalizado },
        include: [
          {
            model: Cliente,
            as: 'cliente'
          },
          {
            model: HistorialEstado,
            as: 'historialEstados',
            order: [['fecha', 'DESC']]
          }
        ]
      });

      if (!orden) {
        throw new Error('No se encontró ninguna orden con ese código');
      }

      return orden;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar estado de la orden
  async actualizarEstado(id, nuevoEstado, notaPublica) {
    try {
      const orden = await OrdenReparacion.findByPk(id, {
        include: [{ model: Cliente, as: 'cliente' }]
      });

      if (!orden) {
        throw new Error('Orden no encontrada');
      }

      const estadoAnterior = orden.estado;

      // Actualizar estado actual en la orden
      await orden.update({ estado: nuevoEstado });

      // Agregar al historial
      await HistorialEstado.create({
        ordenReparacionId: orden.id,
        estadoAnterior,
        estadoNuevo: nuevoEstado,
        notaPublica: notaPublica || `Estado actualizado a ${nuevoEstado}`
      });

      // Notificar al cliente por email
      try {
        await emailService.notificarCambioEstado(
          orden.cliente.correo,
          orden.codigoSeguimiento,
          nuevoEstado,
          notaPublica
        );
      } catch (emailError) {
        // Error silencioso en notificación - no bloquear el proceso
        if (process.env.NODE_ENV === 'development') {
          console.error('Error al enviar notificación:', emailError.message);
        }
      }

      return await this.obtenerOrdenPorId(id);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar orden
  async actualizarOrden(id, datos) {
    try {
      const orden = await OrdenReparacion.findByPk(id);

      if (!orden) {
        throw new Error('Orden no encontrada');
      }

      await orden.update(datos);

      return await this.obtenerOrdenPorId(id);
    } catch (error) {
      throw error;
    }
  }

  // Eliminar orden
  async eliminarOrden(id) {
    try {
      const orden = await OrdenReparacion.findByPk(id);

      if (!orden) {
        throw new Error('Orden no encontrada');
      }

      // Eliminar historial asociado
      await HistorialEstado.destroy({ where: { ordenReparacionId: id } });

      await orden.destroy();

      return { mensaje: 'Orden eliminada exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OrdenService();
