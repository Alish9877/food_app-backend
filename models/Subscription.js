const { Schema } = require('mongoose');

const subscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mealPlan: { type: Schema.Types.ObjectId, ref: 'MealPlan', required: true },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v) => v > Date.now(),
        message: 'Start date must be in the future.',
      },
    },
    duration: { type: Number, required: true },
    mealsPerDay: { type: String, enum: ['1-2', '2-3'], required: true },
    price: { type: Number, required: true },
    preferences: { type: [String], default: [] },
    selectedDays: { type: [String], required: true }, 
  },
  { timestamps: true }
);

module.exports = subscriptionSchema;
