const { MealPlan } = require('../models');

// Get all meal plans
const GetMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({});
    res.send(mealPlans);
  } catch (error) {
    console.error('Error fetching meal plans:', error);
    res.send({ error: 'Error fetching meal plans' });
  }
};

// Get a specific meal plan by ID
const GetMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.send({ error: 'Meal plan not found' });
    }
    res.send(mealPlan);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    res.send({ error: 'Error fetching meal plan' });
  }
};

// Create a new meal plan
const CreateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.create(req.body);
    res.send(mealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    res.send({ error: 'Error creating meal plan' });
  }
};

// Update an existing meal plan
const UpdateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!mealPlan) {
      return res.send({ error: 'Meal plan not found' });
    }
    res.send(mealPlan);
  } catch (error) {
    console.error('Error updating meal plan:', error);
    res.send({ error: 'Error updating meal plan' });
  }
};

// Delete a meal plan
const DeleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndDelete(req.params.id);
    if (!mealPlan) {
      return res.send({ error: 'Meal plan not found' });
    }
    res.send({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting meal plan:', error);
    res.send({ error: 'Error deleting meal plan' });
  }
};

module.exports = {
  GetMealPlans,
  GetMealPlanById,
  CreateMealPlan,
  UpdateMealPlan,
  DeleteMealPlan,
};
