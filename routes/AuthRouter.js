const router = require('express').Router();
const { AuthController } = require('../controllers');
const middleware = require('../middleware');

// User login
router.post('/login', AuthController.Login);

// User registration
router.post('/register', AuthController.Register);

// Update user password (Requires authentication)
router.put(
  '/update/:user_id',
  middleware.stripToken,
  middleware.verifyToken,
  AuthController.UpdatePassword
);

// Check user session validity (Requires authentication)
router.get(
  '/session',
  middleware.stripToken,
  middleware.verifyToken,
  AuthController.CheckSession
);

module.exports = router;
