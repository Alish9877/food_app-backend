const router = require('express').Router();
const controller = require('../controllers/DeliveryController');
const middleware = require('../middleware')

// Admin Routes
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetAllDeliveries
); // Fetch all deliveries
router.post(
  '/:deliveryId/assign',
  middleware.stripToken,
  middleware.verifyToken,
  controller.AssignMeals
); // Assign meals to a delivery
router.put(
  '/:deliveryId/status',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateDeliveryStatus
); // Update delivery status

// User Routes
router.get(
  '/user/:userId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserDeliveries
); // Fetch deliveries for a specific user

module.exports = router;
