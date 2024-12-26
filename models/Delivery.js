const { Schema } = require('mongoose')

const deliverySchema = new Schema(
  {
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true
    },
    deliveryDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Delivered'], required: true },
    location: { type: String, required: true },
    meals: { type: [String], required: true }
  },
  { timestamps: true }
)

module.exports = deliverySchema
