const Sales = require('../models/Sales');
const Products = require('../models/Products');
const { invalidIdOrQuantityError } = require('../utils/bodyValidation');

const create = async (list) => {
  list.forEach(async ({ productId }) => {
    const product = await Products.getById(productId);
    if (!product) {
      return invalidIdOrQuantityError;
    }
  });
  return Sales.create(list);
};

module.exports = {
  create,
};