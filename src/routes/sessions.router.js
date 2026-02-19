const express = require('express');
const passport = require('passport');

const UserCurrentDto = require('../dto/user-current.dto');
const { userRepository } = require('../config/repositories');
const AuthService = require('../services/auth.service');

const router = express.Router();
const authService = new AuthService(userRepository);

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).send({ status: 'error', message: info?.message || 'Credenciales inválidas' });
    }

    const token = authService.createAccessToken(user);

    return res
      .cookie('jwtCookieToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .send({ status: 'success', token });
  })(req, res, next);
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  const userDto = new UserCurrentDto(req.user);
  return res.status(200).send({ status: 'success', user: userDto });
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ status: 'error', message: 'Email requerido' });
  }

  await authService.requestPasswordReset(email);
  return res.send({ status: 'success', message: 'Si el email existe, se envió un enlace de recuperación' });
});

router.get('/reset-password', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send({ status: 'error', message: 'Token requerido' });
  }

  return res.send({
    status: 'success',
    message: 'Token válido. Enviá una petición POST a este mismo endpoint con token y newPassword.',
  });
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).send({ status: 'error', message: 'Token y nueva contraseña requeridos' });
    }

    await authService.resetPassword(token, newPassword);
    return res.send({ status: 'success', message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    return res.status(400).send({ status: 'error', message: error.message || 'No se pudo restablecer contraseña' });
  }
});

module.exports = router;
