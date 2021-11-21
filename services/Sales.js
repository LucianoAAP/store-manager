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

const getStock = async (list) => {
  const validProducts = list.map((product) => product.productId);
  return Products.filterByIds(validProducts);
};

const getNewStock = (stock, list, sign) => (stock.map((product) => {
  const { id, quantity } = product;
  const { quantity: soldQuantity } = list.find((item) => item.productId === id);
  const newQuantity = sign === 'plus' ? quantity + soldQuantity : quantity - soldQuantity;
  return { id, quantity: newQuantity };
}));

const validateSale = async (stock, list) => {
  const newStock = getNewStock(stock, list, 'minus');
  return !newStock.some((product) => product.quantity < 0);
};

const consolidateSale = async (stock, list) => {
  const promises = list.forEach(async (product) => {
    const { productId, quantity: soldQuantity } = product;
    const { name, quantity } = stock.find(({ id }) => id === productId);
    const newQuantity = quantity - soldQuantity;
    await Products.update(productId, name, newQuantity);
  });
  Promise.all(promises);
};

const create = async (list) => {
  const stock = await getStock(list);
  const validStock = !stock.includes(null);
  if (!validStock) return invalidIdOrQuantityError;
  const validation = await validateSale(stock, list);
  if (!validation) return notAllowedAmmountError;
  await consolidateSale(stock, list);
  return Sales.create(list);
};

const validateUpdate = async (oldList, newList) => {
  const stock = await getStock(newList);
  const oldStock = getNewStock(stock, oldList, 'plus');
  const newStock = getNewStock(oldStock, newList, 'minus');
  const isValid = !newStock.some((product) => product.quantity < 0);
  return { isValid, newStock };
};

const consolidateUpdate = async (list) => {
  const promises = list.forEach(async (product) => {
    const { id, name, quantity } = product;
    await Products.update(id, name, quantity);
  });
  Promise.all(promises);
};

const update = async (id, list) => {
  const sale = await getById(id);
  if (sale.err) return sale;
  const validation = await validateUpdate(sale.itensSold, list);
  if (validation.isValid === false) return notAllowedAmmountError;
  await consolidateUpdate(validation.newStock);
  return Sales.update(id, list);
};

const revertSale = async (id) => {
  const { itensSold } = await getById(id);
  const stock = await getStock(itensSold);
  itensSold.forEach(async ({ productId, quantity: soldQuantity }) => {
    const { name, quantity } = stock.find((item) => item.id === productId);
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