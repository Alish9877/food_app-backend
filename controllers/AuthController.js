const { User } = require('../models')
const middleware = require('../middleware')

// User Registration
const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    let passwordDigest = await middleware.hashPassword(password)

    let existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .send({ error: 'A user with that email already exists!' })
    }

    const user = await User.create({
      username,
      email,
      password: passwordDigest
    })
    res.status(201).send(user)
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).send({ error: 'Error registering user' })
  }
}

// User Login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).send({ error: 'Invalid email or password' })
    }

    const matched = await middleware.comparePassword(password, user.passwordDigest)
    if (!matched) {
      return res.status(401).send({ error: 'Invalid email or password' })
    }

    const payload = { id: user._id, username: user.username, role: user.role }
    const token = middleware.createToken(payload)

    res.status(200).send({ user: payload, token })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).send({ error: 'Error logging in' })
  }
}

// Update User Password
const UpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.params.user_id)
    if (!user) {
      return res.status(404).send({ error: 'User not found' })
    }

    const matched = await middleware.comparePassword(oldPassword, user.password)
    if (!matched) {
      return res.status(401).send({ error: 'Old password is incorrect' })
    }

    const passwordDigest = await middleware.hashPassword(newPassword)
    user.password = passwordDigest
    await user.save()

    res.status(200).send({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error updating password:', error)
    res.status(500).send({ error: 'Error updating password' })
  }
}

// Check User Session
const CheckSession = async (req, res) => {
  try {
    const { payload } = res.locals
    res.status(200).send(payload)
  } catch (error) {
    console.error('Error checking session:', error)
    res.status(500).send({ error: 'Error checking session' })
  }
}

module.exports = {
  Register,
  Login,
  UpdatePassword,
  CheckSession
}
