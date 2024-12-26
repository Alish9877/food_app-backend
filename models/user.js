const { Schema } = require('mongoose')

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordDigest: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Subscriber'], default: 'Subscriber' }
  },
  { timestamps: true } 
)

module.exports = userSchema
