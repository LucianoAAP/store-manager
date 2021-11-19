const express = require('express');
const rescue = require('express-rescue');
const Products = require('../services/Products');
const { validateProductsBody } = require('../utils/validations');

const router = express.Router();

router.get('/', rescue(async (_req, res) => {
  const products = await Products.getAll();
  res.status(200).json({ products });
}));

router.get('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.getById(id);
  if (product.err) return next(product.err);
  return res.status(200).json(product);
}));

router.post('/', rescue(async (req, res, next) => {
  const { name, quantity } = req.body;
  const validity = validateProductsBody(name, quantity);
  if (validity.err) return next(validity.err);
  const product = await Products.create(name, quantity);
  if (product.err) return next(product.err);
  return res.status(201).json(product);
}));

router.put('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  const validity = validateProductsBody(name, quantity);
  if (validity.err) return next(validity.err);
  const product = await Products.update(id, name, quantity);
  if (product.err) return next(product.err);
  return res.status(200).json(product);
}));

router.delete('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.erase(id);
  if (product.err) return next(product.err);
  return res.status(200).json(product);
}));

module.exports = router;
