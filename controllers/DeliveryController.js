const { Delivery } = require('../models');

// Get all deliveries (Admin only)
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
    console.error('Error fetching deliveries:', error);
    res.send({ error: 'Error fetching deliveries' });
  }
};

// Get deliveries for a specific subscription
const GetDeliveriesBySubscription = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ subscription: req.params.subscriptionId });
    res.send(deliveries);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.send({ error: 'Error fetching deliveries' });
  }
};

// Assign meals for a delivery
const AssignMeals = async (req, res) => {
  try {
    const { meals } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.deliveryId,
      { meals },
      { new: true }
    );
    if (!delivery) {
      return res.send({ error: 'Delivery not found' });
    }
    res.send(delivery);
  } catch (error) {
    console.error('Error assigning meals:', error);
    res.send({ error: 'Error assigning meals' });
  }
};

// Update delivery status
const UpdateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.deliveryId,
      { status },
      { new: true }
    );
    if (!delivery) {
      return res.send({ error: 'Delivery not found' });
    }
    res.send(delivery);
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.send({ error: 'Error updating delivery status' });
  }
};

// Get deliveries for a specific user (User perspective)
const GetUserDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({})
      .populate({
        path: 'subscription',
        match: { user: req.params.userId },
        populate: { path: 'mealPlan', select: 'name' },
      })
      .exec();
    res.send(deliveries.filter((d) => d.subscription !== null));
  } catch (error) {
    console.error('Error fetching user deliveries:', error);
    res.send({ error: 'Error fetching deliveries' });
  }
};

module.exports = {
  GetAllDeliveries,
  GetDeliveriesBySubscription,
  AssignMeals,
  UpdateDeliveryStatus,
  GetUserDeliveries,
};
