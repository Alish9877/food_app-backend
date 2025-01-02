const { Schema } = require('mongoose')

const mealPlanSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 10 },
    dishes: { type: [String], required: true },
    price: { type: Number, required: true },
    source: { type: String, default: 'local' }, 
    category: { type: String },
    externalId: { type: String, default: null },
  },
  { timestamps: true }
)

module.exports = mealPlanSchema
