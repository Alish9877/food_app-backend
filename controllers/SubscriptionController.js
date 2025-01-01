const { Subscription } = require('../models')

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
      .populate('mealPlan', 'name description')
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
    }).populate('mealPlan', 'name description')
    res.send(subscriptions)
  } catch (error) {
    handleError(res, error, 'Error fetching user subscriptions')
  }
}

// Create a new subscription (User-specific)
const CreateSubscription = async (req, res) => {
  try {
    const { selectedDays } = req.body

    if (
      !selectedDays ||
      !Array.isArray(selectedDays) ||
      selectedDays.length === 0
    ) {
      return res
        .status(400)
        .send({ error: 'Selected days are required and must be an array.' })
    }

    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id
    })
    res.status(201).send(subscription)
  } catch (error) {
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

    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
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
    )
    if (!subscription)
      return res.status(404).send({ error: 'Subscription not found' })
    res.send({ message: 'Subscription canceled successfully' })
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
