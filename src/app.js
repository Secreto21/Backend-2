const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const { MONGO_URI, MONGO_DB_NAME } = require('./config/config');
const initializePassport = require('./config/passport.config');

const usersRouter = require('./routes/users.router');
const sessionsRouter = require('./routes/sessions.router');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);

app.get('/', (req, res) => {
  res.send({ status: 'success', message: 'API ecommerce usuarios OK' });
});

// Conexión a Mongo y arranque del servidor
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
