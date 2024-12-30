const express = require('express');
const logger = require('morgan');
const cors = require('cors');

// Routers (importing centralized routes)
const routes = require('./routes');

const PORT = process.env.PORT || 3001;

const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(routes);

// Default Route
app.use('/', (req, res) => {
  res.send(`Connected to Food Subscription API!`);
});

// Server Listener
app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`);
});
