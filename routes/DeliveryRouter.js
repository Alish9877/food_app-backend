const router = require('express').Router()
const { DeliveryController } = require('../controllers')
const middleware = require('../middleware')

console.log(middleware);

// Fetch all deliveries (Admin only)
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  DeliveryController.GetAllDeliveries
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

// Fetch deliveries for a specific user
router.get(
  '/user/:userId',
  middleware.stripToken,
  middleware.verifyToken,
  DeliveryController.GetUserDeliveries
)

module.exports = router
