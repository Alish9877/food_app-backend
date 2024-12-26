const mongoose = require('mongoose')
const userSchema = require('./User')
const mealPlanSchema = require('./MealPlan')
const subscriptionSchema = require('./Subscription')
const deliverySchema = require('./Delivery')

const User = mongoose.model('User', userSchema)
const MealPlan = mongoose.model('MealPlan', mealPlanSchema)
const Subscription = mongoose.model('Subscription', subscriptionSchema)
const Delivery = mongoose.model('Delivery', deliverySchema)

module.exports = {
  User,
  MealPlan,
  Subscription,
  Delivery
}
