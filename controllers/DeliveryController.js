const { Delivery } = require('../models')

// Utility function for error handling
const handleError = (res, error, message = 'Server error', status = 500) => {
  console.error(message, error)
  res.status(status).send({ status: 'error', message })
}

// Get all deliveries (Admin only)
const GetAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({})
      .populate('subscription', 'user mealPlan')
      .populate({
        path: 'subscription',
        populate: { path: 'user', select: 'username email' }
      })
    res.send(deliveries)
  } catch (error) {
    handleError(res, error, 'Error fetching deliveries')
  }
}

// Get deliveries for a specific subscription
const GetDeliveriesBySubscription = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      subscription: req.params.subscriptionId
    })
    res.send(deliveries)
  } catch (error) {
    handleError(res, error, 'Error fetching deliveries by subscription')
  }
}

// Update delivery (Assign meals or update status)
const UpdateDelivery = async (req, res) => {
  try {
    const updates = req.body
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.deliveryId,
      updates,
      { new: true }
    )
    if (!delivery) {
      return res.status(404).send({ error: 'Delivery not found' })
    }
    res.send(delivery)
  } catch (error) {
    handleError(res, error, 'Error updating delivery')
  }
}

// Get deliveries for a specific user
const GetUserDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({}).populate({
      path: 'subscription',
      match: { user: req.params.userId },
      populate: { path: 'mealPlan', select: 'name' }
    })

    res.send(deliveries.filter((d) => d.subscription !== null))
  } catch (error) {
    handleError(res, error, 'Error fetching user deliveries')
  }
}

module.exports = {
  GetAllDeliveries,
  GetDeliveriesBySubscription,
  UpdateDelivery,
  GetUserDeliveries
}
