const { ObjectId } = require('mongodb');
const connection = require('./connection');

const getAll = async () => connection().then((db) => db.collection('sales').find().toArray());

const getById = async (id) => {
  if (!ObjectId.isValid(id)) return null;
  const sale = await connection().then((db) => db.collection('sales').findOne(ObjectId(id)));
  if (!sale) return null;
  const { itensSold } = sale;
  return { _id: id, itensSold };
};

const create = async (list) => (connection().then((db) => db.collection('sales').insertOne({
    itensSold: list,
  })).then((result) => ({ _id: result.insertedId, itensSold: list })));

const update = async (id, list) => {
  await connection().then((db) => db.collection('sales').updateOne(
    { _id: ObjectId(id) },
    { $set: { itensSold: list } },
  ));
  return getById(id);
};

const erase = async (id) => {
  const sale = await getById(id);
  await connection().then((db) => db.collection('sales').deleteOne({ _id: ObjectId(id) }));
  return sale;
};

module.exports = {
  getAll,
  create,
  getById,
  update,
  erase,
};