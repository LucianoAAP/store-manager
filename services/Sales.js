const Sales = require('../models/Sales');
const Products = require('../models/Products');
const {
  invalidIdOrQuantityError,
  saleNotFoundError,
  wrongSaleIdError,
  notAllowedAmmountError,
} = require('../utils/validations');

const getAll = async () => Sales.getAll();

const getById = async (id) => {
  const sale = await Sales.getById(id);
  if (!sale) return saleNotFoundError;
  return sale;
};

const validateSale = async (list) => {
  const validProducts = list.map((product) => product.productId);
  const stock = await Products.filterByIds(validProducts);
  const newStock = stock.map((product) => {
    const { id, quantity } = product;
    const { productId, quantity: soldQuantity } = list.filter((item) => item.productId === id)[0];
    const newQuantity = quantity - soldQuantity;
    return { productId, quantity: newQuantity };
  });
  return newStock.some((product) => product.quantity >= 0);
};

const consolidateSale = async (list) => {
  list.forEach(async (product) => {
    const { productId, quantity: soldQuantity } = product;
    const { name, quantity } = await Products.getById(productId);
    const newQuantity = quantity - soldQuantity;
    await Products.update(productId, name, newQuantity);
  });
};

const create = async (list) => {
  list.forEach(async (item) => {
    const product = await Products.getById(item.productId);
    if (!product) {
      return invalidIdOrQuantityError;
    }
  });
  const validity = await validateSale(list);
  if (!validity) return notAllowedAmmountError;
  await consolidateSale(list);
  return Sales.create(list);
};

const update = async (id, list) => {
  const sale = await getById(id);
  if (sale.err) return sale;
  return Sales.update(id, list);
};

const revertSale = async (id) => {
  const { itensSold } = await getById(id);
  itensSold.forEach(async ({ productId, quantity: soldQuantity }) => {
    const { name, quantity } = await Products.getById(productId);
    const newQuantity = quantity + soldQuantity;
    await Products.update(productId, name, newQuantity);
  });
};

const erase = async (id) => {
  const sale = await getById(id);
  if (sale.err) return wrongSaleIdError;
  await revertSale(id);
  return Sales.erase(id);
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  erase,
};