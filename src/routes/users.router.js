const express = require('express');
const passport = require('passport');

const authorize = require('../middlewares/authorization.middleware');
const { userRepository, cartRepository } = require('../config/repositories');
const UserService = require('../services/user.service');

const router = express.Router();
const userService = new UserService(userRepository, cartRepository);

router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send({ status: 'error', message: 'Datos incompletos' });
    }

    const user = await userService.createUser({ first_name, last_name, email, age, password, role });
    return res.status(201).send({ status: 'success', payload: user });
  } catch (error) {
    return res.status(400).send({ status: 'error', message: error.message || 'Error en registro' });
  }
});

router.get('/', passport.authenticate('jwt', { session: false }), authorize('admin'), async (req, res) => {
  const users = await userService.getAllUsers();
  return res.send({ status: 'success', payload: users });
});

router.get('/:uid', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const user = await userService.getUserById(req.params.uid);
  if (!user) return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
  return res.send({ status: 'success', payload: user });
});

router.put('/:uid', passport.authenticate('jwt', { session: false }), authorize('admin'), async (req, res) => {
  const user = await userService.updateUser(req.params.uid, req.body);
  return res.send({ status: 'success', payload: user });
});

router.delete('/:uid', passport.authenticate('jwt', { session: false }), authorize('admin'), async (req, res) => {
  await userService.deleteUser(req.params.uid);
  return res.send({ status: 'success', message: 'Usuario eliminado' });
});

module.exports = router;
