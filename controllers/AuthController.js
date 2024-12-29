const { User } = require('../models')
const middleware = require('../middleware')

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
    const user = await User.create({
      username,
      email,
      passwordDigest
    })

    console.log('User Created:', user)
    res.status(201).send({ message: 'User registered successfully', user })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).send({ error: 'Error registering user' })
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
      console.log('No user found with email:', email)
      return res.status(401).send({ error: 'Invalid email or password' })
    }

    const matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )
    if (!matched) {
      console.log('Password mismatch for user:', email)
      return res.status(401).send({ error: 'Invalid email or password' })
    }

    const payload = { id: user._id, username: user.username, role: user.role }
    const token = middleware.createToken(payload)
    console.log('Login Successful. Token:', token)

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
