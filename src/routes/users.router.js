const express = require('express');
const passport = require('passport');
const UserModel = require('../models/user.model');
const { createHash } = require('../utils/bcrypt');

const router = express.Router();

// Middleware simple de autorización por rol
const authorization = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).send({ status: 'error', message: 'No autorizado' });
  }
  next();
};

// Obtener todos los usuarios (solo admin)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorization('admin'),
  async (req, res) => {
    try {
      const users = await UserModel.find();
      res.send({ status: 'success', payload: users });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error obteniendo usuarios' });
    }
  }
);

// Obtener usuario por id
router.get(
  '/:uid',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.uid);
      if (!user) return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
      res.send({ status: 'success', payload: user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error obteniendo usuario' });
    }
  }
);

// Crear usuario (solo admin) - contraseña en hash
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorization('admin'),
  async (req, res) => {
    try {
      const { first_name, last_name, email, age, password, cart, role } = req.body;

      if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send({ status: 'error', message: 'Datos incompletos' });
      }

      const exists = await UserModel.findOne({ email });
      if (exists) {
        return res.status(400).send({ status: 'error', message: 'El email ya está registrado' });
      }

      const newUser = await UserModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        cart,
        role,
      });

      res.status(201).send({ status: 'success', payload: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error creando usuario' });
    }
  }
);

// Actualizar usuario (solo admin)
router.put(
  '/:uid',
  passport.authenticate('jwt', { session: false }),
  authorization('admin'),
  async (req, res) => {
    try {
      const { password, ...rest } = req.body;
      const update = { ...rest };
      if (password) update.password = createHash(password);

      const user = await UserModel.findByIdAndUpdate(req.params.uid, update, {
        new: true,
      });

      res.send({ status: 'success', payload: user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error actualizando usuario' });
    }
  }
);

// Eliminar usuario (solo admin)
router.delete(
  '/:uid',
  passport.authenticate('jwt', { session: false }),
  authorization('admin'),
  async (req, res) => {
    try {
      await UserModel.findByIdAndDelete(req.params.uid);
      res.send({ status: 'success', message: 'Usuario eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ status: 'error', message: 'Error eliminando usuario' });
    }
  }
);

module.exports = router;
