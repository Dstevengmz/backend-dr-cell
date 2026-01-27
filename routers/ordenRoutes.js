const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

// Ruta pública - Consultar estado de orden
router.post('/consultar', ordenController.consultarEstado);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, verificarAdmin, ordenController.crear);
router.get('/', verificarToken, ordenController.obtenerTodas);
router.get('/:id', verificarToken, ordenController.obtenerPorId);
router.put('/:id', verificarToken, verificarAdmin, ordenController.actualizar);
router.put('/:id/estado', verificarToken, verificarAdmin, ordenController.actualizarEstado);
router.delete('/:id', verificarToken, verificarAdmin, ordenController.eliminar);

module.exports = router;
