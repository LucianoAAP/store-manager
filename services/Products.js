const Products = require('../models/Products');

const create = async (name, quantity) => {
  const product = await Products.create(name, quantity);
  if (!product) {
    return { err: { status: 422, code: 'invalid_data', message: 'Product already exists' } };
  }
  return product;
};

module.exports = {
  create,
};
