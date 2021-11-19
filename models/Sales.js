const { ObjectId } = require('mongodb');
const getConnection = require('./connection');

const getAll = async () => getConnection.connect()
  .then((db) => db.collection('sales').find().toArray());

const getById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const sale = await getConnection.connect()
    .then((db) => db.collection('sales').findOne(ObjectId(id)));
  if (!sale) return null;
  return { _id: id, ...sale };
};

const create = async (list) => (getConnection.connect()
  .then((db) => db.collection('sales').insertOne({ itensSold: list }))
  .then((result) => ({ _id: result.insertedId, itensSold: list })));

const update = async (id, list) => {
  await getConnection.connect().then((db) => db.collection('sales').updateOne(
    { _id: ObjectId(id) },
    { $set: { itensSold: list } },
  ));
  return { _id: id, itensSold: list };
};

const erase = async (id) => {
  const sale = await getById(id);
  await getConnection.connect()
    .then((db) => db.collection('sales').deleteOne({ _id: ObjectId(id) }));
  return sale;
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  erase,
};