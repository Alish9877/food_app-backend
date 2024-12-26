const router = require('express').Router();
const controller = require('../controllers/SubscriptionController');
const middleware = require('./middleware');

// Admin Routes
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetAllSubscriptions
); // Fetch all subscriptions

router.get(
  '/user/:userId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserSubscriptions
); // Fetch subscriptions for a specific user

// User Routes
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateSubscription
);// Create a new subscription

router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateSubscription
); // Update a subscription

router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CancelSubscription
); // Cancel a subscription

module.exports = router;
