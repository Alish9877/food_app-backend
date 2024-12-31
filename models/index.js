const mongoose = require('mongoose')
const userSchema = require('./User')
const mealPlanSchema = require('./MealPlan')
const subscriptionSchema = require('./Subscription')
const deliverySchema = require('./Delivery')
const selectedMealSchema = require("./selectedMeal")
// Initialize models
const User = mongoose.model('User', userSchema)
const MealPlan = mongoose.model('MealPlan', mealPlanSchema)
const Subscription = mongoose.model('Subscription', subscriptionSchema)
const Delivery = mongoose.model('Delivery', deliverySchema)
const selectedMeal = mongoose.model("selectedMeal", selectedMealSchema)

module.exports = {
  User,
  MealPlan,
  Subscription,
  Delivery,
  selectedMeal
}
