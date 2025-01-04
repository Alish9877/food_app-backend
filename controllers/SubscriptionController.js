const { Subscription, MealPlan } = require('../models')
const mongoose = require('mongoose')

const handleError = (res, error, message = 'Server error', status = 500) => {
  console.error(message, error)
  res.status(status).send({ status: 'error', message })
}

// Fetch all subscriptions (Admin only)
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

// Fetch subscriptions for a specific user
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

// Create a new subscription
const CreateSubscription = async (req, res) => {
  try {
    const {
      startDate,
      deliveryTime,
      selectedDays,
      mealPlans,
      price,
      duration,
      mealsPerDay,
      preferences
    } = req.body

    // Validation Helper Functions
    const isValidArray = (arr) => Array.isArray(arr) && arr.length > 0

    const validateFields = () => {
      if (!isValidArray(selectedDays)) {
        throw {
          status: 400,
          message: 'Selected days are required and must be an array.'
        }
      }

      if (!isValidArray(mealPlans)) {
        throw {
          status: 400,
          message:
            'mealPlans must contain valid ObjectId values and cannot be empty.'
        }
      }

      if (
        !startDate ||
        isNaN(new Date(startDate)) ||
        new Date(startDate) <= Date.now()
      ) {
        throw {
          status: 400,
          message: 'startDate must be a valid and future date.'
        }
      }

      if (price === undefined || price === null) {
        throw { status: 400, message: 'Price is required.' }
      }

      if (duration === undefined || mealsPerDay < 1 || mealsPerDay > 3) {
        throw {
          status: 400,
          message: 'Valid duration and mealsPerDay are required.'
        }
      }

      if (!req.user || !req.user.id) {
        throw { status: 401, message: 'User not authenticated' }
      }
    }

    // Validate input fields
    validateFields()

    // Validate mealPlans
    const validMealPlans = await MealPlan.find({
      _id: {
        $in: mealPlans.filter((id) => mongoose.Types.ObjectId.isValid(id))
      }
    })

    if (validMealPlans.length !== mealPlans.length) {
      throw { status: 400, message: 'One or more mealPlans are invalid.' }
    }

    // Prepare subscription data
    const subscriptionData = {
      mealPlans: validMealPlans.map((meal) => meal._id),
      startDate,
      duration,
      mealsPerDay,
      price,
      selectedDays,
      user: req.user.id,
      preferences: preferences || []
    }

    if (deliveryTime) subscriptionData.preferences.push(deliveryTime)

    // Create subscription
    const subscription = await Subscription.create(subscriptionData)
    res.status(201).send(subscription)
  } catch (error) {
    console.error('Error in CreateSubscription:', error)
    const status = error.status || 500
    const message = error.message || 'Error creating subscription'
    res.status(status).send({ error: message })
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
