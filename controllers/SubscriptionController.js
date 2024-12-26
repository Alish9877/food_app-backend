const { Subscription } = require('../models')

// Get all subscriptions (Admin only)
const GetAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate('user', 'username email')
      .populate('mealPlan', 'name description')
    res.send(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    res.send({ error: 'Error fetching subscriptions' })
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
    console.error('Error fetching user subscriptions:', error)
    res.send({ error: 'Error fetching subscriptions' })
  }
}

// Create a new subscription
const CreateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id
    })
    res.send(subscription)
  } catch (error) {
    console.error('Error creating subscription:', error)
    res.send({ error: 'Error creating subscription' })
  }
}

// Update an existing subscription
const UpdateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!subscription) {
      return res.send({ error: 'Subscription not found' })
    }
    res.send(subscription)
  } catch (error) {
    console.error('Error updating subscription:', error)
    res.send({ error: 'Error updating subscription' })
  }
}

// Cancel a subscription (soft delete by setting active status to false)
const CancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )
    if (!subscription) {
      return res.send({ error: 'Subscription not found' })
    }
    res.send({ message: 'Subscription canceled successfully' })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    res.send({ error: 'Error canceling subscription' })
  }
}

module.exports = {
  GetAllSubscriptions,
  GetUserSubscriptions,
  CreateSubscription,
  UpdateSubscription,
  CancelSubscription
}
