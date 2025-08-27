const express = require('express');
const CartManager = require('../CartManager');
const ProductManager = require('../ProductManager');

const router = express.Router();

const cartsManager = new CartManager('./data/carts.json');
const productsManager = new ProductManager('./data/products.json');

router.post('/', async (req, res) => {
  const newCart = await cartsManager.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = await cartsManager.getCartById(cartId);
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }
  res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);

  const product = await productsManager.getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const updatedCart = await cartsManager.addProductToCart(cartId, productId);
  if (!updatedCart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(updatedCart);
});

module.exports = router;
