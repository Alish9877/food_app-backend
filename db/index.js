const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB...');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

// mongoose.set('debug', true);

const db = mongoose.connection;

module.exports = db;
