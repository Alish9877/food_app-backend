const express = require('express');

// Import individual routers
const MealPlanRouter = require('./MealPlanRouter');
const SubscriptionRouter = require('./SubscriptionRouter');
const UserRouter = require('./UserRouter');
const AuthRouter = require('./AuthRouter');
const DeliveryRouter = require('./DeliveryRouter');

const router = express.Router();

// Use individual routers
router.use('/meal-plans', MealPlanRouter);
router.use('/subscriptions', SubscriptionRouter);
router.use('/users', UserRouter);
router.use('/auth', AuthRouter);
router.use('/deliveries', DeliveryRouter);

module.exports = router;
