const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(verificarToken);

router.post('/', verificarAdmin, proveedorController.crear);
router.get('/', proveedorController.obtenerTodos);
router.get('/:id', proveedorController.obtenerPorId);
router.put('/:id', verificarAdmin, proveedorController.actualizar);
router.delete('/:id', verificarAdmin, proveedorController.eliminar);

module.exports = router;
