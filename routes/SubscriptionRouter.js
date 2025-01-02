const router = require('express').Router();
const { SubscriptionController } = require('../controllers');
const middleware = require('../middleware');

// Fetch all subscriptions (Admin only)
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  SubscriptionController.GetAllSubscriptions
);

// Fetch subscriptions for a specific user
router.get(
  '/user/:userId',
  middleware.stripToken,
  middleware.verifyToken,
  SubscriptionController.GetUserSubscriptions
);

// Create a new subscription (any authorized user)
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  SubscriptionController.CreateSubscription
);

// Update a subscription (any authorized user)
router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  SubscriptionController.UpdateSubscription
);

// Cancel a subscription (soft delete)
router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  SubscriptionController.CancelSubscription
);

module.exports = router;
