const express = require('express');
const ProductManager = require('../src/ProductManager');

const router = express.Router();
const manager = new ProductManager('./data/products.json');

// GET /
router.get('/', async (req, res) => {
  const products = await manager.getProducts();
  res.json({ products });
});

// GET /:pid
router.get('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const product = await manager.getProductById(id);
  if (product) {
    res.json({ product });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// POST /
router.post('/', async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await manager.addProduct(product);
    res.status(201).json({ product: newProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /:pid
router.put('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const update = req.body;
  try {
    const updatedProduct = await manager.updateProduct(id, update);
    if (updatedProduct) {
      res.json({ product: updatedProduct });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /:pid
router.delete('/:pid', async (req, res) => {
  const id = parseInt(req.params.pid);
  const deleted = await manager.deleteProduct(id);
  if (deleted) {
    res.json({ message: 'Producto eliminado correctamente' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

module.exports = router;
