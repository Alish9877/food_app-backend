const { Delivery } = require('../models');

// Utility: Centralized error handling
const handleError = (res, error, message = 'Server error', status = 500) => {
  console.error(message, error);
  res.status(status).send({ status: 'error', message });
};

// Fetch all deliveries (Admin only)
const GetAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({})
      .populate('subscription', 'user mealPlan')
      .populate({
        path: 'subscription',
        populate: { path: 'user', select: 'username email' },
      });
    res.send(deliveries);
  } catch (error) {
    handleError(res, error, 'Error fetching deliveries');
  }
};

// Fetch deliveries for a specific subscription
const GetDeliveriesBySubscription = async (req, res) => {
  try {
    const deliveries = await Delivery.find({
      subscription: req.params.subscriptionId,
    });
    res.send(deliveries);
  } catch (error) {
    handleError(res, error, 'Error fetching deliveries by subscription');
  }
};

// Fetch deliveries for a specific user
const GetUserDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({}).populate({
      path: 'subscription',
      match: { user: req.params.userId },
      populate: { path: 'mealPlan', select: 'name' },
    });
    res.send(deliveries.filter((d) => d.subscription !== null));
  } catch (error) {
    handleError(res, error, 'Error fetching user deliveries');
  }
};

// Assign meals to a delivery (Admin only)
const AssignMeals = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { meals } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { meals },
      { new: true }
    );

    if (!delivery) return res.status(404).send({ error: 'Delivery not found' });
    res.send({ message: 'Meals assigned successfully', delivery });
  } catch (error) {
    handleError(res, error, 'Error assigning meals to delivery');
  }
};

// Update the delivery status (Admin only)
const UpdateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status },
      { new: true }
    );

    if (!delivery)
      return res.status(404).send({ error: 'Delivery not found' });
    res.send({ message: 'Delivery status updated successfully', delivery });
  } catch (error) {
    handleError(res, error, 'Error updating delivery status');
  }
};

// Create a new delivery (Admin only)
const CreateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).send(delivery);
  } catch (error) {
    handleError(res, error, 'Error creating delivery');
  }
};

module.exports = {
  GetAllDeliveries,
  GetDeliveriesBySubscription,
  GetUserDeliveries,
  AssignMeals,
  UpdateDeliveryStatus,
  CreateDelivery,
};
