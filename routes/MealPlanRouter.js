const router = require('express').Router()
const { MealPlanController } = require('../controllers')
const middleware = require('../middleware')

// Fetch all meal plans (Public route)
router.get('/', MealPlanController.GetMealPlans)

// Fetch a meal plan by ID (Public route)
router.get('/:id', MealPlanController.GetMealPlanById)

// Create a new meal plan (Admin only)
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  MealPlanController.CreateMealPlan
)

// Update an existing meal plan (Admin only)
router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  MealPlanController.UpdateMealPlan
)

// Delete a meal plan (Admin only)
router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  MealPlanController.DeleteMealPlan
)

// Save selected meals (Public route)
router.post(
  '/selected-meals',
  middleware.stripToken,
  middleware.verifyToken,
  MealPlanController.SaveSelectedMeals
)

module.exports = router
