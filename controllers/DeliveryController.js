const { Delivery } = require('../models')

// Utility: Centralized error handling
const handleError = (res, error, message = 'Server error', status = 500) => {
  console.error(message, error)
  res.status(status).send({ status: 'error', message })
}

// Fetch all deliveries (Admin only)
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

// Fetch deliveries for a specific subscription (Admin only)
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

// Fetch deliveries for a specific user
const GetUserDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({})
      .populate({
        path: 'subscription', 
        match: { user: req.params.userId },
        populate: {
          path: 'mealPlans',
          select: 'name description',
        },
      });
    const filteredDeliveries = deliveries.filter(
      (delivery) => delivery.subscription !== null
    );
    res.json(filteredDeliveries);
  } catch (error) {
    console.error('Error fetching user deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch user deliveries' });
  }
};


// Assign meals to a delivery (Admin only)
const AssignMeals = async (req, res) => {
  try {
    const { deliveryId } = req.params
    const { meals } = req.body

    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { meals },
      { new: true }
    )
    if (!delivery) {
      return res.status(404).send({ error: 'Delivery not found' })
    }
    res.send({ message: 'Meals assigned successfully', delivery })
  } catch (error) {
    handleError(res, error, 'Error assigning meals to delivery')
  }
}

// Update the delivery status (Admin only)
const UpdateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params
    const { status } = req.body

    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      { status },
      { new: true }
    )
    if (!delivery) {
      return res.status(404).send({ error: 'Delivery not found' })
    }
    res.send({ message: 'Delivery status updated successfully', delivery })
  } catch (error) {
    handleError(res, error, 'Error updating delivery status')
  }
}

// Create a new delivery (Admin only)
const CreateDelivery = async (req, res) => {
  try {
    const { subscription, deliveryDate, location, meals } = req.body

    if (!subscription || !deliveryDate || !location || !meals) {
      return res
        .status(400)
        .send({ error: 'All required fields must be provided' })
    }

    const delivery = await Delivery.create({
      subscription,
      deliveryDate,
      location,
      meals
    })

    res.status(201).send(delivery)
  } catch (error) {
    handleError(res, error, 'Error creating delivery')
  }
}

// Update a delivery (Admin only)
const UpdateDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const updatedData = req.body;

    const updatedDelivery = await Delivery.findByIdAndUpdate(deliveryId, updatedData, { new: true });
    if (!updatedDelivery) {
      return res.status(404).send({ error: 'Delivery not found' });
    }
    res.send({ message: 'Delivery updated successfully', delivery: updatedDelivery });
  } catch (error) {
    handleError(res, error, 'Error updating delivery');
  }
};

// Delete a delivery (Admin only)
const DeleteDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params
    const deletedDelivery = await Delivery.findByIdAndDelete(deliveryId)
    if (!deletedDelivery) {
      return res.status(404).send({ error: 'Delivery not found' })
    }
    res.send({
      message: 'Delivery deleted successfully',
      delivery: deletedDelivery
    })
  } catch (error) {
    handleError(res, error, 'Error deleting delivery')
  }
}

module.exports = {
  GetAllDeliveries,
  GetDeliveriesBySubscription,
  GetUserDeliveries,
  AssignMeals,
  UpdateDeliveryStatus,
  CreateDelivery,
  UpdateDelivery,
  DeleteDelivery
}
