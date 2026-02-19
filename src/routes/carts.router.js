const express = require('express');
const passport = require('passport');

const authorize = require('../middlewares/authorization.middleware');
const { cartRepository, productRepository, ticketRepository } = require('../config/repositories');
const CartService = require('../services/cart.service');

const router = express.Router();
const cartService = new CartService(cartRepository, productRepository, ticketRepository);

router.post('/products/:pid', passport.authenticate('jwt', { session: false }), authorize('user'), async (req, res) => {
  try {
    const quantity = Number(req.body.quantity || 1);
    const cart = await cartService.addProductToCart(req.user._id, req.params.pid, quantity);
    return res.send({ status: 'success', payload: cart });
  } catch (error) {
    return res.status(400).send({ status: 'error', message: error.message });
  }
});

router.post('/purchase', passport.authenticate('jwt', { session: false }), authorize('user'), async (req, res) => {
  try {
    const result = await cartService.purchaseCart(req.user);
    return res.send({ status: 'success', payload: result });
  } catch (error) {
    return res.status(400).send({ status: 'error', message: error.message });
  }
});

module.exports = router;
