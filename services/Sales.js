const Sales = require('../models/Sales');
const Products = require('../models/Products');
const {
  invalidIdOrQuantityError,
  saleNotFoundError,
  wrongSaleIdError,
} = require('../utils/bodyValidation');

const getAll = async () => Sales.getAll();

const getById = async (id) => {
  const sale = await Sales.getById(id);
  if (!sale) return saleNotFoundError;
  return sale;
};

const create = async (list) => {
  list.forEach(async ({ productId }) => {
    const product = await Products.getById(productId);
    if (!product) {
      return invalidIdOrQuantityError;
    }
  });
  return Sales.create(list);
};

const update = async (id, list) => {
  const sale = await getById(id);
  if (sale.err) return sale;
  return Sales.update(id, list);
};

const erase = async (id) => {
  const sale = await getById(id);
  if (sale.err) return wrongSaleIdError;
  return Sales.erase(id);
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  erase,
};