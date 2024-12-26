const { Schema } = require('mongoose');

const subscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mealPlan: { type: Schema.Types.ObjectId, ref: 'MealPlan', required: true },
    startDate: { type: Date, required: true },
    duration: { type: Number, required: true },
    mealsPerDay: { type: String, enum: ['1-2', '2-3'], required: true },
    price: { type: Number, required: true },
    preferences: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = subscriptionSchema;
