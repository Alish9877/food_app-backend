const { Schema } = require('mongoose')

const mealPlanSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 10 },
    dishes: { type: [String], required: true },
    price: { type: Number, required: true },
    customPrice: { type: Number, default: null },
    source: { type: String, default: 'local' },
    category: { type: String },
    externalId: { type: String, default: null },
    image: {
      url: { type: String, default: null }, 
      data: { type: Buffer },
      contentType: { type: String },
    }
  },
  { timestamps: true }
)

module.exports = mealPlanSchema
