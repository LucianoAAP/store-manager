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

module.exports = {
  getAll,
  create,
  getById,
};