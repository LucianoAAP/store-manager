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

const update = async (id, name, quantity) => {
  await connection().then((db) => db.collection('products').updateOne(
    { _id: ObjectId(id) },
    { $set: { name, quantity } },
  ));
  return getById(id);
};

const erase = async (id) => {
  const product = await getById(id);
  await connection().then((db) => db.collection('products').deleteOne({ _id: ObjectId(id) }));
  return product;
};

const filterByIds = async (list) => {
  const ids = list.map((id) => ObjectId(id));
  const products = await connection()
    .then((db) => db.collection('products').find({ _id: { $in: ids } }).toArray())
    .then((items) => items.map(({ _id, quantity }) => ({ id: _id.toString(), quantity })));
  return products;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  erase,
  filterByIds,
};