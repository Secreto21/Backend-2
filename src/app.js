const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const { MONGO_URI, MONGO_DB_NAME, PORT } = require('./config/config');
const initializePassport = require('./config/passport.config');

const usersRouter = require('./routes/users.router');
const sessionsRouter = require('./routes/sessions.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', (req, res) => {
  res.send({ status: 'success', message: 'API ecommerce arquitectura profesional OK' });
});

mongoose
  .connect(MONGO_URI, { dbName: MONGO_DB_NAME })
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err);
  });

module.exports = app;
