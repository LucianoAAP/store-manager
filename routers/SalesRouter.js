const express = require('express');
const rescue = require('express-rescue');
const { getAll, getById, create, update, erase } = require('../controllers/Sales');

const router = express.Router();

router.get('/', rescue(getAll));

router.get('/:id', rescue(getById));

router.post('/', rescue(create));

router.put('/:id', rescue(update));

router.delete('/:id', rescue(erase));

module.exports = router;
