const { User } = require('../models')

// Utility function for error handling
const handleError = (res, error, message = 'Server error', status = 500) => {
  console.error(message, error)
  res.status(status).send({ status: 'error', message })
}

// Get all users (Admin only)
const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email role') // Limit fields to return
    res.send(users)
  } catch (error) {
    handleError(res, error, 'Error fetching all users')
  }
}

// Get a specific user by ID (Admin or User themselves)
const GetUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'username email role')
    if (!user) return res.status(404).send({ error: 'User not found' })
    res.send(user)
  } catch (error) {
    handleError(res, error, 'Error fetching user')
  }
}

// Update user profile (User themselves)
const UpdateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    )
    if (!user) return res.status(404).send({ error: 'User not found' })
    res.send(user)
  } catch (error) {
    handleError(res, error, 'Error updating user profile')
  }
}

// Delete user account (Admin or User themselves)
const DeleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).send({ error: 'User not found' })
    res.send({ message: 'User account deleted successfully' })
  } catch (error) {
    handleError(res, error, 'Error deleting user account')
  }
}

module.exports = {
  GetAllUsers,
  GetUserById,
  UpdateUserProfile,
  DeleteUserAccount
}
