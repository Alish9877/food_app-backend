const { User } = require('../models');

// Get all users (Admin only)
const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email role'); // Fetch all users with selected fields
    res.send(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.send({ error: 'Error fetching users' });
  }
};

// Get a specific user by ID (Admin or User themselves)
const GetUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'username email role');
    if (!user) {
      return res.send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.send({ error: 'Error fetching user' });
  }
};

// Update user profile
const UpdateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true } // Return updated user and validate input
    );
    if (!user) {
      return res.send({ error: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.send({ error: 'Error updating profile' });
  }
};

// Delete user account (Admin or User themselves)
const DeleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.send({ error: 'User not found' });
    }
    res.send({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.send({ error: 'Error deleting user' });
  }
};

module.exports = {
  GetAllUsers,
  GetUserById,
  UpdateUserProfile,
  DeleteUserAccount,
};
