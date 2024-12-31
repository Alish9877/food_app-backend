const { User } = require('../models')
const middleware = require('../middleware')

// Utility function for error handling
const handleError = (res, error, message = 'Server error', status = 500) => {
  console.error(message, error)
  res.status(status).send({ status: 'error', message })
}

// User Registration
const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).send({ error: 'All fields are required!' })
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res
        .status(400)
        .send({ error: 'Email or username already exists!' })
    }

    const passwordDigest = await middleware.hashPassword(password)
    const user = await User.create({ username, email, passwordDigest })

    res.status(201).send({ message: 'User registered successfully', user })
  } catch (error) {
    handleError(res, error, 'Error during registration')
  }
}

// User Login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).send({ error: 'Email and password are required!' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).send({ error: 'Invalid email or password' })
    }

    const matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )
    if (!matched) {
      return res.status(401).send({ error: 'Invalid email or password' })
    }

    const payload = { id: user._id, username: user.username, role: user.role }
    const token = middleware.createToken(payload)

    res.status(200).send({ user: payload, token })
  } catch (error) {
    handleError(res, error, 'Error during login')
  }
}

// Update User Password
const UpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .send({ error: 'Old and new passwords are required!' })
    }

    const user = await User.findById(req.params.user_id)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }

    const matched = await middleware.comparePassword(
      oldPassword,
      user.passwordDigest
    )
    if (!matched) {
      return res.status(401).send({ error: 'Old password is incorrect' })
    }

    const passwordDigest = await middleware.hashPassword(newPassword)
    user.passwordDigest = passwordDigest
    await user.save()

    res.status(200).send({ message: 'Password updated successfully' })
  } catch (error) {
    handleError(res, error, 'Error updating password')
  }
}

// Check User Session
const CheckSession = (req, res) => {
  try {
    const { payload } = res.locals
    if (!payload) throw new Error('Invalid session')
    res.status(200).send(payload)
  } catch (error) {
    console.error('Session check failed:', error.message)
    res.status(401).send({ error: 'Invalid session' })
  }
}

module.exports = {
  Register,
  Login,
  UpdatePassword,
  CheckSession
}
