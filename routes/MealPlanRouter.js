const router = require('express').Router()
const controller = require('../controllers/MealPlanController')
const middleware = require('./middleware')

// Public Routes
router.get('/', controller.GetMealPlans) // Fetch all meal plans
router.get('/:id', controller.GetMealPlanById) // Fetch a meal plan by ID

// Admin Routes
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.CreateMealPlan
) // Create a new meal plan
router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateMealPlan
) // Update an existing meal plan
router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteMealPlan
) // Delete a meal plan

module.exports = router
