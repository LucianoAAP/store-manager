const express = require('express');
const rescue = require('express-rescue');
const Products = require('../services/Products');

const router = express.Router();

const INVALID_DATA = 'invalid_data';
const shortNameError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: '"name" length must be at least 5 characters long' } };
const quantityLessThan1Error = { err: {
  status: 422,
  code: INVALID_DATA,
  message: '"quantity" must be larger than or equal to 1',
} };
const quantityNotANumberError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: '"quantity" must be a number',
} };

const missingDataError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: '"name" and "quantity" are required',
} };

const checkRequiredData = (name, quantity) => {
  if (name === undefined || quantity === undefined) return false;
  return true;
};

const validate = (name, quantity) => {
  const requiredData = checkRequiredData(name, quantity);
  if (!requiredData) return missingDataError;
  if (name.length < 5) return shortNameError;
  if (quantity <= 0) return quantityLessThan1Error;
  if (Number.isNaN(parseInt(quantity, 10))) return quantityNotANumberError;
  return 'OK';
};

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
  const validity = validate(name, quantity);
  if (validity.err) return next(validity.err);
  const product = await Products.create(name, quantity);
  if (product.err) return next(product.err);
  return res.status(201).json(product);
}));

module.exports = router;
