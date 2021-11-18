const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('products').find().toArray());

const getById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const product = await connection().then((db) => db.collection('products').findOne(ObjectId(id)));
  if (!product) return null;
  const { name, quantity } = product;
  return { _id: id, name, quantity };
};

const create = async (name, quantity) => {
  const nameData = await connection().then((db) => db.collection('products').findOne({ name }));
  if (nameData) return null;
  return connection().then((db) => db.collection('products').insertOne({
    name,
    quantity,
  })).then((result) => ({ _id: result.insertedId, name, quantity }));
};

module.exports = {
  getAll,
  getById,
  create,
};