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

router.post(
  '/import-external',
  middleware.stripToken,
  middleware.verifyToken, // only requires user to be logged in, no isAdmin
  MealPlanController.ImportExternalMealPlan
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

// Save selected meals (User must be logged in)
router.post(
  '/selected-meals',
  middleware.stripToken,
  middleware.verifyToken,
  MealPlanController.SaveSelectedMeals
)

module.exports = router
