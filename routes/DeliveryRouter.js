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

// Fetch deliveries for a specific subscription (Admin only)
router.get(
  '/subscription/:subscriptionId',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.GetDeliveriesBySubscription
)

// Fetch deliveries for a specific user (needs to be logged in, but admin vs user checks can vary)
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

// Update a delivery (Admin only)
router.put(
  '/:deliveryId',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.UpdateDelivery
)

// Delete a delivery (Admin only)
router.delete(
  '/:deliveryId',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.DeleteDelivery
)

module.exports = router
