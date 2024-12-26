const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10)
const APP_SECRET = process.env.APP_SECRET

// Hashes the password
const hashPassword = async (password) => {
  let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  return hashedPassword
}

// Compares the plain-text password with the hashed password
const comparePassword = async (password, storedPassword) => {
  let passwordMatch = await bcrypt.compare(password, storedPassword)
  return passwordMatch
}

// Creates a token using the payload
const createToken = (payload) => {
  let token = jwt.sign(payload, APP_SECRET)
  return token
}

// Extracts the token from the authorization header
const stripToken = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]
    if (token) {
      res.locals.token = token
      return next()
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.error('Error in stripToken:', error)
    res.status(401).send({ status: 'Error', msg: 'Strip Token Error!' })
  }
}

// Verifies the token and stores its payload
const verifyToken = (req, res, next) => {
  const { token } = res.locals
  try {
    let payload = jwt.verify(token, APP_SECRET)
    if (payload) {
      res.locals.payload = payload
      return next()
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.error('Error in verifyToken:', error)
    res.status(401).send({ status: 'Error', msg: 'Verify Token Error!' })
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  stripToken,
  verifyToken
}
