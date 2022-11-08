const express = require('express');
const {
  createWearable, 
  getWearables,
  getWearable,
  deleteWearable,
  updateWearable
} = require('../controllers/wearableControllers')

const router = express.Router();

// GET all wearable data
router.get('/', getWearables)

// GET data by id
router.get('/:id', getWearable)

// POST a wearable data
router.post('/', createWearable)

// DELETE a wearable data
router.delete('/:id', deleteWearable)

// UPDATE a wearable data
router.patch('/:id', updateWearable)

module.exports = router;