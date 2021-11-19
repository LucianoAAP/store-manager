const express = require('express');
const rescue = require('express-rescue');
const Sales = require('../services/Sales');
const { validateSalesQuantity } = require('../utils/bodyValidation');

const router = express.Router();

router.get('/', rescue(async (_req, res) => {
  const sales = await Sales.getAll();
  res.status(200).json({ sales });
}));

router.get('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;
  const sale = await Sales.getById(id);
  if (sale.err) return next(sale.err);
  return res.status(200).json(sale);
}));

router.post('/', rescue(async (req, res, next) => {
  const list = req.body;
  list.forEach(({ quantity }) => {
    const validity = validateSalesQuantity(quantity);
    if (validity.err) return next(validity.err);
  });
  const sale = await Sales.create(list);
  if (sale.err) return next(sale.err);
  return res.status(200).json(sale);
}));

router.put('/:id', rescue(async (req, res, next) => {
  const { id } = req.params;
  const list = req.body;
  list.forEach(({ quantity }) => {
    const validity = validateSalesQuantity(quantity);
    if (validity.err) return next(validity.err);
  });
  const sale = await Sales.update(id, list);
  if (sale.err) return next(sale.err);
  return res.status(200).json(sale);
}));

module.exports = router;
