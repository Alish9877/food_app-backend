const { Schema } = require('mongoose')

const selectedMealSchema = new Schema(
  {
    mealId: { type: Schema.Types.ObjectId, ref: 'MealPlan', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

module.exports = selectedMealSchema
