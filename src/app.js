const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const ProductManager = require('./ProductManager');

const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer);

const PORT = 8080;
const manager = new ProductManager('./src/data/products.json');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
  const products = await manager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

io.on('connection', async (socket) => {
  console.log('Cliente conectado');

  socket.emit('products', await manager.getProducts());

  socket.on('addProduct', async (data) => {
    try {
      if (!data.description) data.description = "Sin descripción";
      if (!data.code) data.code = Math.random().toString(36).substring(7);
      if (!data.status) data.status = true;
      if (!data.category) data.category = "General";
      if (!data.thumbnails) data.thumbnails = [];

      await manager.addProduct(data);
      io.emit('products', await manager.getProducts());
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  socket.on('deleteProduct', async (id) => {
    await manager.deleteProduct(parseInt(id));
    io.emit('products', await manager.getProducts());
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
