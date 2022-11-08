const express = require('express');
const Wearable = require('../models/wearableModel')

const router = express.Router();

// GET all wearable data
router.get('/', (req, res) => {
  res.json({mssg: 'GET all wearable data'});
})

// GET data by id
router.get('/:id', (req, res) => {
  res.json({mssg: 'GET a date data'});
})

// POST a wearable data
router.post('/', async (req, res) => {
  const {date, content} = req.body;

  try {
    const wearable = await Wearable.create({date, content});
    res.status(200).json(wearable)
  } catch(error) {
    res.status(400).json({error: error.message})
  }
})

// DELETE a wearable data
router.delete('/:id', (req, res) => {
  res.json({mssg: 'DELETE a new wearable data'});
})

// UPDATE a wearable data
router.patch('/:id', (req, res) => {
  res.json({mssg: 'UPDATE a new wearable data'});
})

module.exports = router;