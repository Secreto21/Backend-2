const express = require('express');
const passport = require('passport');

const authorize = require('../middlewares/authorization.middleware');
const { productRepository } = require('../config/repositories');
const ProductService = require('../services/product.service');

const router = express.Router();
const productService = new ProductService(productRepository);

router.get('/', async (req, res) => {
  const products = await productService.getProducts();
  return res.send({ status: 'success', payload: products });
});

router.post('/', passport.authenticate('jwt', { session: false }), authorize('admin'), async (req, res) => {
  const product = await productService.createProduct(req.body);
  return res.status(201).send({ status: 'success', payload: product });
});

router.put('/:pid', passport.authenticate('jwt', { session: false }), authorize('admin'), async (req, res) => {
  const product = await productService.updateProduct(req.params.pid, req.body);
  return res.send({ status: 'success', payload: product });
});

router.delete('/:pid', passport.authenticate('jwt', { session: false }), authorize('admin'), async (req, res) => {
  await productService.deleteProduct(req.params.pid);
  return res.send({ status: 'success', message: 'Producto eliminado' });
});

module.exports = router;
