const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { v4: uuidv4 } = require('uuid')

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10
const APP_SECRET = process.env.APP_SECRET || 'your_default_secret'
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
    console.log(" Stripped token ",token);
    
    res.locals.token = token
    console.log(" res.locals.token ",res.locals.token);
    
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
    console.log('Decoded Payload:', payload);
    res.locals.payload = payload
    req.user = payload
    console.log('req.user:', req.user);
    next()
  } catch (error) {
    console.error('Error in verifyToken:', error.message)
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  }
}

// Middleware: Check if the user is an admin
const isAdmin = (req, res, next) => {
  const { role } = req.user || {}
  if (role === 'Admin') {
    return next()
  }
  res.status(403).send({ status: 'Error', msg: 'Admin access only' })
}

// Middleware: Standard Authorization Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).send({ error: 'Unauthorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { _id: decoded.id }
    next()
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' })
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  stripToken,
  verifyToken,
  isAdmin,
  authMiddleware 
}
