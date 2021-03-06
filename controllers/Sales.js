const Sales = require('../services/Sales');
const { validateSalesQuantity } = require('../utils/validations');

const getAll = async (_req, res) => {
  const sales = await Sales.getAll();
  return res.status(200).json({ sales });
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const sale = await Sales.getById(id);
  if (sale.err) return next(sale.err);
  return res.status(200).json(sale);
};

const create = async (req, res, next) => {
  const list = req.body;
  const validationArray = list.map((product) => validateSalesQuantity(product.quantity));
  const validation = validationArray.find((response) => response.err);
  if (validation) return next(validation.err);
  const sale = await Sales.create(list);
  if (sale.err) return next(sale.err);
  return res.status(200).json(sale);
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const list = req.body;
  const validationArray = list.map((product) => validateSalesQuantity(product.quantity));
  const validation = validationArray.find((response) => response.err);
  if (validation) return next(validation.err);
  const sale = await Sales.update(id, list);
  if (sale.err) return next(sale.err);
  return res.status(200).json(sale);
};

const erase = async (req, res, next) => {
  const { id } = req.params;
  const sale = await Sales.erase(id);
  if (sale.err) return next(sale.err);
  return res.status(200).json(sale);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  erase,
};
