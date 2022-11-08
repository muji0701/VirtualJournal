require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const wearableRoutes = require('./routes/wearable');

const app = express();

// middleware
// It parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json())

// print the HTTP method
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next()
})

// routes
app.use('/api/wearable', wearableRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('listening on port', process.env.PORT);
    })
  })
  .catch((error) => {
    console.log(error)
  })



