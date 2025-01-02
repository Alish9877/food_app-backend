// controllers/SubscriptionController.js

const { Subscription, MealPlan } = require('../models')

// Utility function for error handling
const handleError = (res, error, message = 'Server error', status = 500) => {
  console.error(message, error)
  res.status(status).send({ status: 'error', message })
}

// Get all subscriptions (Admin only)
const GetAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate('user', 'username email')
      .populate('mealPlans', 'name description')
    res.send(subscriptions)
  } catch (error) {
    handleError(res, error, 'Error fetching all subscriptions')
  }
}

// Get subscriptions for a specific user
const GetUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      user: req.params.userId
    }).populate('mealPlans', 'name description')
    res.send(subscriptions)
  } catch (error) {
    handleError(res, error, 'Error fetching user subscriptions')
  }
}

// Create a new subscription (User-specific)
const CreateSubscription = async (req, res) => {
  try {
    // Extract and map fields from the request body
    const {
      startingDay,
      deliveryTime,
      selectedDays,
      selectedMeals,
      totalPrice,
      duration,
      mealsPerDay,
      preferences
    } = req.body

    // Validate selectedDays
    if (
      !selectedDays ||
      !Array.isArray(selectedDays) ||
      selectedDays.length === 0
    ) {
      return res
        .status(400)
        .send({ error: 'Selected days are required and must be an array.' })
    }

    // Validate selectedMeals
    if (
      !selectedMeals ||
      !Array.isArray(selectedMeals) ||
      selectedMeals.length === 0
    ) {
      return res.status(400).send({
        error: 'selectedMeals are required and must be a non-empty array.'
      })
    }

    // Validate startingDay
    if (!startingDay) {
      return res.status(400).send({ error: 'startingDay is required.' })
    }

    // Validate totalPrice
    if (totalPrice === undefined || totalPrice === null) {
      return res.status(400).send({ error: 'totalPrice is required.' })
    }

    // Validate duration
    if (duration === undefined || duration === null) {
      return res.status(400).send({ error: 'duration is required.' })
    }

    // Validate mealsPerDay
    if (typeof mealsPerDay !== 'number' || mealsPerDay < 1 || mealsPerDay > 3) {
      return res.status(400).send({
        error: 'mealsPerDay is required and must be a number between 1 and 3.'
      })
    }

    const startDate = new Date(startingDay)
    if (isNaN(startDate)) {
      return res
        .status(400)
        .send({ error: 'startingDay must be a valid date.' })
    }

    if (startDate <= Date.now()) {
      return res.status(400).send({ error: 'startDate must be in the future.' })
    }

    const uniqueSelectedMeals = [...new Set(selectedMeals)]

    const mealPlans = await MealPlan.find({
      name: { $in: uniqueSelectedMeals }
    })

    if (mealPlans.length !== uniqueSelectedMeals.length) {
      return res
        .status(400)
        .send({ error: 'One or more selectedMeals are invalid.' })
    }

    const mealPlanIds = mealPlans.map((meal) => meal._id)

    let updatedPreferences = preferences || []
    if (deliveryTime) {
      updatedPreferences.push(deliveryTime)
    }

    const subscriptionData = {
      mealPlans: mealPlanIds,
      startDate,
      duration,
      mealsPerDay,
      price: totalPrice,
      selectedDays,
      user: req.user._id,
      preferences: updatedPreferences
    }

    // Create the subscription in the database
    const subscription = await Subscription.create(subscriptionData)

    // Send the created subscription as a response
    res.status(201).send(subscription)
  } catch (error) {
    console.error('Error in CreateSubscription:', error)

    // Enhanced error handling for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return res
        .status(400)
        .send({ status: 'error', message: messages.join(', ') })
    }

    // Fallback to generic error handler
    handleError(res, error, 'Error creating subscription')
  }
}

// Update an existing subscription
const UpdateSubscription = async (req, res) => {
  try {
    const { selectedDays } = req.body
    if (
      selectedDays &&
      (!Array.isArray(selectedDays) || selectedDays.length === 0)
    ) {
      return res
        .status(400)
        .send({ error: 'Selected days must be a non-empty array.' })
    }

    // Optionally, handle selectedMeals similarly to CreateSubscription if updating mealPlans

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('mealPlans', 'name description')

    if (!subscription) {
      return res.status(404).send({ error: 'Subscription not found' })
    }
    res.send(subscription)
  } catch (error) {
    handleError(res, error, 'Error updating subscription')
  }
}

// Cancel a subscription (Soft delete)
const CancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    ).populate('mealPlans', 'name description')

    if (!subscription) {
      return res.status(404).send({ error: 'Subscription not found' })
    }
    res.send({ message: 'Subscription canceled successfully', subscription })
  } catch (error) {
    handleError(res, error, 'Error canceling subscription')
  }
}

module.exports = {
  GetAllSubscriptions,
  GetUserSubscriptions,
  CreateSubscription,
  UpdateSubscription,
  CancelSubscription
}
