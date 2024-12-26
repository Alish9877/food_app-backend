const { Schema } = require('mongoose')

const mealPlanSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    dishes: { type: [String], required: true }
  },
  { timestamps: true }
)

module.exports = mealPlanSchema
