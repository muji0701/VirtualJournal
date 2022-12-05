const Wearable = require('../models/wearableModel');
const mongoose = require('mongoose');
const map_hr = new Map();
const map_step = new Map();
const map_GPS = new Map();
// get all wearable data
const getWearables = async (req, res) => {
  console.log('req',req);
  const HR = req.headers.hr;
  const step = req.headers.step;
  const GPS = req.headers.gps;
  
  const HR_data = JSON.parse(HR);
  const step_data = JSON.parse(step);
  const GPS_data = JSON.parse(GPS);

  Object.keys(HR_data).forEach(key => {
    classifyHRByTime(key, Number(HR_data[key]))
  });
  Object.keys(step_data).forEach(key => {
    classifyStepByTime(key, Number(step_data[key]))
  });
  console.log('map_hr', map_hr);
  console.log('map_step', map_step);

const request = require('request');

request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=32.8753%2C-117.220438&rankby=distance&key=AIzaSyA5K9xIog3RQb55NagkFPOd0LXT2P5T3vY', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log('results', res.body.results);
});
  res.status(200).send('success');
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

const classifyHRByTime = (dateAndTime, num) => {
  const words = dateAndTime.split(' ');
  const time = words[3];
  const arr = time.split(':');
  const hour = arr[0];
  if(map_hr.has(hour)) {
    const list = map_hr.get(hour);
    list[1] = list[1]+1;
    list[0] = (list[0]*(list[1]-1)+num)/list[1];
    map_hr.set(hour, list);
  }else {
    map_hr.set(hour, [num, 1]);
  }
}

const classifyStepByTime = (dateAndTime, num) => {
  const words = dateAndTime.split(' ');
  const time = words[3];
  const arr = time.split(':');
  const hour = arr[0];
  if(map_step.has(hour)) {
    const list = map_step.get(hour);
    list[1] = list[1]+1;
    list[0] = (list[0]*(list[1]-1)+num)/list[1];
    map_step.set(hour, list);
  }else {
    map_step.set(hour, [num, 1]);
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