const express = require('express')
const logger = require('morgan')
const cors = require('cors')

// Import centralized routes
const routes = require('./routes')
const db = require('./db')

const PORT = process.env.PORT || 3001

const app = express()

// Middleware setup
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// API Routes
app.use(routes)

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Food Subscription API!')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
