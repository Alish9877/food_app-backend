const { Schema } = require('mongoose')

const deliverySchema = new Schema(
  {
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true
    },
    deliveryDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v > Date.now(),
        message: 'Delivery date must be in the future.'
      }
    },
    status: {
      type: String,
      enum: ['Pending', 'Delivered'],
      default: 'Pending'
    },
    location: { type: String, required: true },
    meals: { type: [String], required: true }
  },
  { timestamps: true }
)

module.exports = deliverySchema
