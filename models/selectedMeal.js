const { Schema } = require('mongoose');

const selectedMealSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    meals: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MealPlan',
        required: true
      }
    ]
  },
  { timestamps: true }
);

module.exports = selectedMealSchema;