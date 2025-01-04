const router = require('express').Router();
const upload = require('../middleware/multer');
const { UserController } = require('../controllers');
const middleware = require('../middleware');

// Fetch all users (Admin only)
router.get(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  UserController.GetAllUsers
);

// Fetch a specific user by ID (Admin only)
router.get(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  middleware.isAdmin,
  UserController.GetUserById
);

// Update user profile (with image upload)
router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  upload.single('profileImage'),
  UserController.UpdateUserProfile
);

// Delete user account
router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  UserController.DeleteUserAccount
);

module.exports = router;
