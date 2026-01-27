const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  // Obtener o crear transporter
  getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
    return this.transporter;
  }

  // Enviar código de seguimiento al cliente
  async enviarCodigoSeguimiento(email, codigoSeguimiento, datosOrden) {
    try {
      const transporter = this.getTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Seguimiento - Reparación de Dispositivo',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h2 style="color: white; margin: 0 0 15px 0; font-size: 28px;">✅ ¡Orden Registrada!</h2>
              <p style="color: #f0f0f0; margin: 0; font-size: 16px;">Tu dispositivo está en buenas manos</p>
            </div>
            
            <p style="font-size: 16px; color: #333;">Hola <strong>${datosOrden.nombreCliente}</strong>,</p>
            <p style="font-size: 16px; color: #333;">Tu dispositivo <strong>${datosOrden.marca} ${datosOrden.modelo}</strong> ha sido registrado exitosamente en nuestro sistema.</p>
            
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 10px; margin: 30px 0; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
              <p style="color: white; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">🔑 TU CÓDIGO PARA CONSULTAR EL ESTADO ES:</p>
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <p style="font-size: 36px; font-weight: bold; color: #f5576c; text-align: center; letter-spacing: 4px; margin: 0; font-family: 'Courier New', monospace;">
                  ${codigoSeguimiento}
                </p>
              </div>
              <p style="color: white; margin: 10px 0 0 0; font-size: 14px;">💾 Guarda este código, lo necesitarás para consultar tu reparación</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #555;"><strong>📱 Equipo:</strong> ${datosOrden.marca} ${datosOrden.modelo}</p>
              <p style="margin: 5px 0; color: #555;"><strong>🔧 Problema:</strong> ${datosOrden.problemaReportado}</p>
              <p style="margin: 5px 0; color: #555;"><strong>📅 Fecha de ingreso:</strong> ${new Date(datosOrden.fechaIngreso).toLocaleDateString('es-ES')}</p>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
              <p style="margin: 0; color: #1976d2; font-size: 15px;">
                💡 <strong>¿Cómo consultar el estado?</strong><br>
                Ingresa solo tu código de seguimiento en nuestra página web y podrás ver el progreso de tu reparación en tiempo real.
              </p>
            </div>
            
            <p style="color: #6c757d; font-size: 14px;">
              Si tienes alguna duda, no dudes en contactarnos.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error('No se pudo enviar el email de confirmación');
    }
  }

  // Notificar cambio de estado
  async notificarCambioEstado(email, codigoSeguimiento, nuevoEstado, descripcion) {
    try {
      const transporter = this.getTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Actualización de Estado - ${codigoSeguimiento}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Actualización de tu Reparación</h2>
            <p>Tu dispositivo ha cambiado de estado:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #28a745; margin-top: 0;">Estado Actual:</h3>
              <p style="font-size: 20px; font-weight: bold; color: #2c3e50;">
                ${nuevoEstado.toUpperCase()}
              </p>
              ${descripcion ? `<p style="color: #6c757d;">${descripcion}</p>` : ''}
            </div>
            
            <p>Código de seguimiento: <strong>${codigoSeguimiento}</strong></p>
            
            <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
              Puedes consultar el estado completo de tu reparación en cualquier momento usando tu código de seguimiento.
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error al enviar email de actualización:', error);
      // No lanzar error para que no falle la actualización de estado
      return false;
    }
  }
}

module.exports = new EmailService();
