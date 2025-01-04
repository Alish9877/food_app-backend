const router = require('express').Router();
const upload = require('../middleware/multer');
const { MealPlanController } = require('../controllers');
const middleware = require('../middleware');

// Fetch all meal plans (Public route)
router.get('/', MealPlanController.GetMealPlans);

// Fetch a meal plan by ID (Public route)
router.get('/:id', MealPlanController.GetMealPlanById);

// Create a new meal plan (Admin only, with image upload)
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  upload.single('image'), // Handle image upload
  MealPlanController.CreateMealPlan
);

// Import an external meal plan (Authenticated users)
router.post(
  '/import-external',
  middleware.stripToken,
  middleware.verifyToken,
  MealPlanController.ImportExternalMealPlan
);

// Update an existing meal plan (Admin only, with image upload)
router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  upload.single('image'), // Handle image upload
  MealPlanController.UpdateMealPlan
);

// Delete a meal plan (Admin only)
router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  MealPlanController.DeleteMealPlan
);

module.exports = router;
