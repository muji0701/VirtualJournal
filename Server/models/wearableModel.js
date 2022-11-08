const mongoose = require('mongoose')

const Schema = mongoose.Schema

const wearableSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    required: false
  }
}, { timestamps: true })

module.exports = mongoose.model('wearable', wearableSchema)