const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas de inventario requieren autenticación
router.use(verificarToken);

// Rutas de inventario
router.post('/', verificarAdmin, inventarioController.crear);
router.get('/', inventarioController.obtenerTodos);
router.get('/stock-bajo', inventarioController.obtenerStockBajo);
router.get('/:id', inventarioController.obtenerPorId);
router.put('/:id', verificarAdmin, inventarioController.actualizar);
router.delete('/:id', verificarAdmin, inventarioController.eliminar);

// Rutas de movimientos de inventario
router.post('/movimiento', verificarAdmin, inventarioController.registrarMovimiento);
router.get('/movimientos/historial', inventarioController.obtenerMovimientos);

module.exports = router;
