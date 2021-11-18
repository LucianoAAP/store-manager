const INVALID_DATA = 'invalid_data';
const NOT_FOUND = 'not_found';

const shortNameError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: '"name" length must be at least 5 characters long' } };
const quantityLessThan1Error = { err: {
  status: 422,
  code: INVALID_DATA,
  message: '"quantity" must be larger than or equal to 1',
} };
const quantityNotANumberError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: '"quantity" must be a number',
} };

const missingDataError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: '"name" and "quantity" are required',
} };

const wrongIdError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: 'Wrong id format',
} };

const productAlreadyExistsError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: 'Product already exists',
} };

const invalidIdOrQuantityError = { err: {
  status: 422,
  code: INVALID_DATA,
  message: 'Wrong product ID or invalid quantity',
} };

const saleNotFoundError = { err: {
  status: 404,
  code: NOT_FOUND,
  message: 'Sale not found',
} };

const checkRequiredData = (name, quantity) => {
  if (name === undefined || quantity === undefined) return false;
  return true;
};

const validateProductsBody = (name, quantity) => {
  const requiredData = checkRequiredData(name, quantity);
  if (!requiredData) return missingDataError;
  if (name.length < 5) return shortNameError;
  if (quantity <= 0) return quantityLessThan1Error;
  if (Number.isNaN(parseInt(quantity, 10))) return quantityNotANumberError;
  return 'OK';
};

const validateSalesBody = (quantity) => {
  if (quantity === undefined) return invalidIdOrQuantityError;
  if (quantity <= 0) return invalidIdOrQuantityError;
  if (Number.isNaN(parseInt(quantity, 10))) return invalidIdOrQuantityError;
  return 'OK';
};

module.exports = {
  validateProductsBody,
  wrongIdError,
  productAlreadyExistsError,
  invalidIdOrQuantityError,
  validateSalesBody,
  saleNotFoundError,
};
