const connection = require('./connection');

const create = async (list) => (connection().then((db) => db.collection('sales').insertOne({
    itensSold: list,
  })).then((result) => ({ _id: result.insertedId, itensSold: list })));

module.exports = {
  create,
};