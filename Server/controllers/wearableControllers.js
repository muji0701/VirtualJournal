const Wearable = require('../models/wearableModel');
const mongoose = require('mongoose');

// get all wearable data
const getWearables = async (req, res) => {
  const wearables = await Wearable.find({}).sort({createdAt: -1});

  res.status(200).json(wearables);
}

//get a single wearable data
const getWearable = async(req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such wearable'});
  }

  const wearable = await Wearable.findById(id);

  if (!wearable) {
    return res.status(404).json({error: 'No such wearable'});
  }

  res.status(200).json(wearable);
} 

// create a new wearable data
const createWearable = async (req, res) => {
  const {date, content} = req.body;

  try {
    const wearable = await Wearable.create({date, content});
    res.status(200).json(wearable);
  } catch(error) {
    res.status(400).json({error: error.message});
  }
}

// delete a wearable data
const deleteWearable = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such wearable'});
  }

  const wearable = await Wearable.findOneAndDelete({_id: id});

  if (!wearable) {
    return res.status(400).json({error: 'No such wearable'})
  }

  res.status(200).json(wearable);
}

// update a wearable data
const updateWearable = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such wearable'});
  }

  const wearable = await Wearable.findOneAndUpdate({_id: id}, {
    ...req.body
  });

  if (!wearable) {
    return res.status(400).json({error: 'No such wearable'})
  }

  res.status(200).json(wearable);
}

module.exports = {
  createWearable,
  getWearables,
  getWearable,
  deleteWearable,
  updateWearable
}