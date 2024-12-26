const express = require('express')
const logger = require('morgan')
const cors = require('cors')

// Routers
const AuthRouter = require('./routes/AuthRouter')
const MealPlanRouter = require('./routes/MealPlanRouter')
const SubscriptionRouter = require('./routes/SubscriptionRouter')
const DeliveryRouter = require('./routes/DeliveryRouter')
const UserRouter = require('./routes/UserRouter')

const PORT = process.env.PORT || 3001

const db = require('./db')

const app = express()

// Middleware
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/auth', AuthRouter)
app.use('/meal-plans', MealPlanRouter)
app.use('/subscriptions', SubscriptionRouter)
app.use('/deliveries', DeliveryRouter)
app.use('/users', UserRouter)

// Default Route
app.use('/', (req, res) => {
  res.send(`Connected to Food Subscription API!`)
})

// Server Listener
app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
