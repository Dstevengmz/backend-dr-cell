const { Producto, Categoria } = require('../models');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');
const { Op } = require('sequelize');

// Obtener todos los productos con paginación
exports.obtenerProductos = async (req, res) => {
  try {
    const { page = 1, limit = 8, categoria, buscar, destacado } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (categoria) where.categoriaId = categoria;
    if (buscar) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${buscar}%` } },
        { descripcion: { [Op.like]: `%${buscar}%` } }
      ];
    }
    if (destacado) where.destacado = true;

    const { count, rows } = await Producto.findAndCountAll({
      where,
      include: [{ model: Categoria, as: 'categoria' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      productos: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Crear producto con imagen
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoriaId, estado, destacado } = req.body;
    
    let imagenUrl = null;
    let imagenPublicId = null;

    // Si hay imagen, subirla a Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'productos');
      imagenUrl = result.secure_url;
      imagenPublicId = result.public_id;
    }

    const producto = await Producto.create({
      nombre,
      descripcion,
      precio,
      stock: stock || 0,
      categoriaId,
      imagenUrl,
      imagenPublicId,
      estado: estado || 'nuevo',
      destacado: destacado === 'true' || destacado === true
    });

    const productoConCategoria = await Producto.findByPk(producto.id, {
      include: [{ model: Categoria, as: 'categoria' }]
    });

    res.status(201).json(productoConCategoria);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, categoriaId, estado, destacado } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    let imagenUrl = producto.imagenUrl;
    let imagenPublicId = producto.imagenPublicId;

    // Si hay nueva imagen, eliminar la anterior y subir la nueva
    if (req.file) {
      if (producto.imagenPublicId) {
        await deleteFromCloudinary(producto.imagenPublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'productos');
      imagenUrl = result.secure_url;
      imagenPublicId = result.public_id;
    }

    await producto.update({
      nombre,
      descripcion,
      precio,
      stock,
      categoriaId,
      imagenUrl,
      imagenPublicId,
      estado,
      destacado: destacado === 'true' || destacado === true
    });

    const productoActualizado = await Producto.findByPk(id, {
      include: [{ model: Categoria, as: 'categoria' }]
    });

    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar imagen de Cloudinary si existe
    if (producto.imagenPublicId) {
      await deleteFromCloudinary(producto.imagenPublicId);
    }

    await producto.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

// Obtener producto por ID
exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id, {
      include: [{ model: Categoria, as: 'categoria' }]
    });

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};
