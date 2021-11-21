const { ObjectId } = require('mongodb');
const getConnection = require('./connection');

const getAll = async () => (getConnection.connect()
  .then((db) => db.collection('products').find().toArray()));

const getById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const product = await getConnection.connect()
    .then((db) => db.collection('products').findOne(ObjectId(id)));
  if (!product) return null;
  return { _id: id, ...product };
};

const create = async (name, quantity) => {
  const nameData = await getConnection.connect()
    .then((db) => db.collection('products').findOne({ name }));
  if (nameData) return null;
  return getConnection.connect().then((db) => db.collection('products').insertOne({
    name,
    quantity,
  })).then((result) => ({ _id: result.insertedId, name, quantity }));
};

const update = async (id, name, quantity) => {
  await getConnection.connect().then((db) => db.collection('products').updateOne(
    { _id: ObjectId(id) },
    { $set: { name, quantity } },
  ));
  return { _id: id, name, quantity };
};

const erase = async (id) => {
  const product = await getById(id);
  await getConnection.connect()
    .then((db) => db.collection('products').deleteOne({ _id: ObjectId(id) }));
  return product;
};

const filterByIds = async (list) => {
  const ids = list.map((id) => ObjectId(id));
  const products = await getConnection.connect()
    .then((db) => db.collection('products').find({ _id: { $in: ids } }).toArray())
    .then((items) => items
      .map(({ _id, name, quantity }) => ({ id: _id.toString(), name, quantity })));
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