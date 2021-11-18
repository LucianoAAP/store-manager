const express = require('express');
const rescue = require('express-rescue');
const Sales = require('../services/Sales');
const { validateSalesBody } = require('../utils/bodyValidation');

const router = express.Router();

router.post('/', rescue(async (req, res, next) => {
  const list = req.body;
  console.log(list);
  list.forEach(({ quantity }) => {
    const validity = validateSalesBody(quantity);
    if (validity.err) return next(validity.err);
  });
  const sale = await Sales.create(list);
  if (sale.err) return next(sale.err);
  return res.status(200).json(sale);
}));

module.exports = router;
