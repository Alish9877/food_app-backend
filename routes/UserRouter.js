const router = require('express').Router()
const controller = require('../controllers/UserController')
const middleware = require('./middleware')

// Admin Routes
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetAllUsers
) // Fetch all users
router.get(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.GetUserById
) // Fetch a specific user by ID

// User Routes
router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.UpdateUserProfile
) // Update user profile
router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.DeleteUserAccount
) // Delete user account

module.exports = router
