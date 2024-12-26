const router = require('express').Router()
const { UserController } = require('../controllers')
const middleware = require('../middleware')

// Fetch all users (Admin only)
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  UserController.GetAllUsers
)

// Fetch a specific user by ID (Admin only)
router.get(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  UserController.GetUserById
)

// Update user profile
router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  UserController.UpdateUserProfile
)

// Delete user account
router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  UserController.DeleteUserAccount
)

module.exports = router
