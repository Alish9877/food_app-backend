const { Schema } = require('mongoose')

const subscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mealPlans: [
      { type: Schema.Types.ObjectId, ref: 'MealPlan', required: true }
    ],
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v > Date.now(),
        message: 'Start date must be in the future.'
      }
    },
    duration: { type: Number, required: true },
    mealsPerDay: {
      type: Number,
      required: true,
      min: [1, 'mealsPerDay must be at least 1.'],
      max: [3, 'mealsPerDay cannot exceed 3.']
    },
    price: { type: Number, required: true },
    preferences: { type: [String], default: [] },
    selectedDays: { type: [String], required: true },

    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

module.exports = subscriptionSchema
