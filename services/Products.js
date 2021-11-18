const Products = require('../models/Products');

const getAll = async () => Products.getAll();

const getById = async (id) => {
  const product = await Products.getById(id);
  if (!product) return { err: { status: 422, code: 'invalid_data', message: 'Wrong id format' } };
  return product;
};

const create = async (name, quantity) => {
  const product = await Products.create(name, quantity);
  if (!product) {
    return { err: { status: 422, code: 'invalid_data', message: 'Product already exists' } };
  }
  return product;
};

const update = async (id, name, quantity) => {
  const product = await getById(id);
  if (product.err) return product;
  return Products.update(id, name, quantity);
};

const erase = async (id) => {
  const product = await getById(id);
  if (product.err) return product;
  return Products.erase(id);
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  erase,
};
