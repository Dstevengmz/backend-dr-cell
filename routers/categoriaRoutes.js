const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

// Rutas públicas (GET)
router.get('/', categoriaController.obtenerTodas);
router.get('/:id', categoriaController.obtenerPorId);

// Rutas protegidas (POST, PUT, DELETE)
router.post('/', verificarToken, verificarAdmin, categoriaController.crear);
router.put('/:id', verificarToken, verificarAdmin, categoriaController.actualizar);
router.delete('/:id', verificarToken, verificarAdmin, categoriaController.eliminar);

module.exports = router;
