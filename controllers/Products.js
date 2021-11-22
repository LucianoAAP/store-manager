const Products = require('../services/Products');
const { validateProductsBody } = require('../utils/validations');

const getAll = async (_req, res) => {
  const products = await Products.getAll();
  return res.status(200).json({ products });
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.getById(id);
  if (product.err) return next(product.err);
  return res.status(200).json(product);
};

const create = async (req, res, next) => {
  const { name, quantity } = req.body;
  const validation = validateProductsBody(name, quantity);
  if (validation.err) return next(validation.err);
  const product = await Products.create(name, quantity);
  if (product.err) return next(product.err);
  return res.status(201).json(product);
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  const validation = validateProductsBody(name, quantity);
  if (validation.err) return next(validation.err);
  const product = await Products.update(id, name, quantity);
  if (product.err) return next(product.err);
  return res.status(200).json(product);
};

const erase = async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.erase(id);
  if (product.err) return next(product.err);
  return res.status(200).json(product);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  erase,
};
