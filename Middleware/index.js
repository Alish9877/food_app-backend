const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10)
const APP_SECRET = process.env.APP_SECRET

const { v4: uuidv4 } = require('uuid')
const serverId = uuidv4()

// Utilities
const hashPassword = async (password) => bcrypt.hash(password, SALT_ROUNDS)

const comparePassword = async (password, storedPassword) =>
  bcrypt.compare(password, storedPassword)

const createToken = (payload) => {
  return jwt.sign({ ...payload, serverId }, APP_SECRET, { expiresIn: '1h' })
}

// Middleware: Extract the token from the Authorization header
const stripToken = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
      throw new Error('No token provided')
    }
    res.locals.token = token
    next()
  } catch (error) {
    console.error('Error in stripToken:', error.message)
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  }
}

// Middleware: Verify the token and store its decoded payload
const verifyToken = (req, res, next) => {
  try {
    const payload = jwt.verify(res.locals.token, APP_SECRET)
    if (payload.serverId !== serverId) {
      throw new Error('Invalid session due to server restart')
    }
    res.locals.payload = payload
    next()
  } catch (error) {
    console.error('Error in verifyToken:', error.message)
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  }
}

// Middleware: Check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = res.locals.payload || {}
  if (role === 'Admin') {
    return next()
  }
  res.status(403).send({ status: 'Error', msg: 'Admin access only' })
}

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  stripToken,
  verifyToken,
  isAdmin
}
