const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/config');
const UserModel = require('../models/user.model');
const { createHash } = require('../utils/bcrypt');

const router = express.Router();

// (Opcional) Registro de usuario usando hash de contraseña
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({ status: 'error', message: 'Datos incompletos' });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.status(400).send({ status: 'error', message: 'El usuario ya existe' });
    }

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    });

    return res.status(201).send({ status: 'success', payload: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: 'error', message: 'Error en el registro' });
  }
});

// Login: genera JWT (en cookie y en body)
router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).send({ status: 'error', message: info?.message || 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res
      .cookie('jwtCookieToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .send({ status: 'success', token });
  })(req, res, next);
});

// Current: devuelve usuario asociado al JWT
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const user = req.user.toObject ? req.user.toObject() : req.user;
    delete user.password;

    return res.status(200).send({
      status: 'success',
      user,
    });
  }
);

module.exports = router;
