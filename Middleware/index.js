const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);
const APP_SECRET = process.env.APP_SECRET;

// Hashes the password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compares the plain-text password with the hashed password
const comparePassword = async (password, storedPassword) => {
  return await bcrypt.compare(password, storedPassword);
};

// Creates a token using the payload
const createToken = (payload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: '1d' });
};

// Middleware to extract the token from the authorization header
const stripToken = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    res.locals.token = token;
    next();
  } catch (error) {
    console.error('Error in stripToken:', error.message);
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' });
  }
};

// Middleware to verify the token and store its payload
const verifyToken = (req, res, next) => {
  try {
    const payload = jwt.verify(res.locals.token, APP_SECRET);
    res.locals.payload = payload;
    next();
  } catch (error) {
    console.error('Error in verifyToken:', error.message);
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' });
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
  stripToken,
  verifyToken,
};
