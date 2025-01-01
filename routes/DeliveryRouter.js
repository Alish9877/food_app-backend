const router = require('express').Router()
const { DeliveryController } = require('../controllers')
const middleware = require('../middleware')

// Fetch all deliveries (Admin only)
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.GetAllDeliveries
)

// Fetch deliveries for a specific subscription
router.get(
  '/subscription/:subscriptionId',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.GetDeliveriesBySubscription
)

// Fetch deliveries for a specific user
router.get(
  '/user/:userId',
  middleware.stripToken,
  middleware.verifyToken,
  DeliveryController.GetUserDeliveries
)

// Create a new delivery (Admin only)
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.CreateDelivery
)

// Assign meals to a delivery (Admin only)
router.post(
  '/:deliveryId/assign',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.AssignMeals
)

// Update delivery status (Admin only)
router.put(
  '/:deliveryId/status',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.UpdateDeliveryStatus
)

// Delete a delivery (Admin only)
router.delete(
  '/:deliveryId',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  async (req, res) => {
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
      console.error('Error deleting delivery:', error)
      res.status(500).send({ error: 'Server error' })
    }
  }
)

module.exports = router
