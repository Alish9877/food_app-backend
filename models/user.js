const { Schema } = require('mongoose')

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
      lowercase: true
    },
    passwordDigest: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'Subscriber'],
      default: 'Subscriber'
    },
    profileImage: {
      data: Buffer,
      contentType: String,
      url: { type: String, default: null }
    }
  },
  { timestamps: true }
)

module.exports = userSchema
