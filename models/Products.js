const connection = require('./connection');

const create = async (name, quantity) => {
  const nameData = await connection().then((db) => db.collection('products').findOne({ name }));
  if (nameData) return null;
  return connection().then((db) => db.collection('products').insertOne({
    name,
    quantity,
  })).then((result) => ({ _id: result.insertedId, name, quantity }));
};

module.exports = {
  create,
};