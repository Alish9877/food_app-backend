const { User } = require('../models');
const middleware = require('../middleware');

// User Registration
const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash the provided password
    let passwordDigest = await middleware.hashPassword(password);

    // Check if a user with the same email already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ error: 'A user with that email already exists!' });
    }

    // Create a new user with default 'Subscriber' role
    const user = await User.create({ username, email, password: passwordDigest });
    res.send(user);
  } catch (error) {
    console.error('Error during registration:', error);
    res.send({ error: 'Error registering user' });
  }
};

// User Login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({ error: 'Invalid email or password' });
    }

    // Compare provided password with stored password digest
    const matched = await middleware.comparePassword(password, user.password);
    if (!matched) {
      return res.send({ error: 'Invalid email or password' });
    }

    // Create a token payload
    const payload = { id: user._id, username: user.username, role: user.role };
    const token = middleware.createToken(payload);

    res.send({ user: payload, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.send({ error: 'Error logging in' });
  }
};

// Update User Password
const UpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(req.params.user_id);
    if (!user) {
      return res.send({ error: 'User not found' });
    }

    // Verify old password
    const matched = await middleware.comparePassword(oldPassword, user.password);
    if (!matched) {
      return res.send({ error: 'Old password is incorrect' });
    }

    // Hash new password and update user
    const passwordDigest = await middleware.hashPassword(newPassword);
    user.password = passwordDigest;
    await user.save();

    res.send({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.send({ error: 'Error updating password' });
  }
};

// Check User Session
const CheckSession = async (req, res) => {
  try {
    const { payload } = res.locals;
    res.send(payload);
  } catch (error) {
    console.error('Error checking session:', error);
    res.send({ error: 'Error checking session' });
  }
};

module.exports = {
  Register,
  Login,
  UpdatePassword,
  CheckSession,
};
