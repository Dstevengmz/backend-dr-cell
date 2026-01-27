const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { upload } = require('../config/cloudinary');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', productoController.obtenerProductos);
router.get('/:id', productoController.obtenerProductoPorId);

// Rutas protegidas (requieren autenticación)
router.post('/', verificarToken, upload.single('imagen'), productoController.crearProducto);
router.put('/:id', verificarToken, upload.single('imagen'), productoController.actualizarProducto);
router.delete('/:id', verificarToken, productoController.eliminarProducto);

module.exports = router;
