const { MealPlan, SelectedMeal } = require('../models')

// Utility function for error handling
const handleError = (res, error, message = 'Server error', status = 500) => {
  console.error(message, error)
  res.status(status).send({ status: 'error', message })
}

// Get all meal plans
const GetMealPlans = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const mealPlans = await MealPlan.find(filter)
    res.send(mealPlans)
  } catch (error) {
    handleError(res, error, 'Error fetching meal plans')
  }
}

// Get a specific meal plan by ID
const GetMealPlanById = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id)
    if (!mealPlan) return res.status(404).send({ error: 'Meal plan not found' })
    res.send(mealPlan)
  } catch (error) {
    handleError(res, error, 'Error fetching meal plan')
  }
}

// Create a new meal plan (Admin only)
const CreateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.create(req.body)
    res.status(201).send(mealPlan)
  } catch (error) {
    handleError(res, error, 'Error creating meal plan')
  }
}

// Update an existing meal plan (Admin only)
const UpdateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!mealPlan) return res.status(404).send({ error: 'Meal plan not found' })
    res.send(mealPlan)
  } catch (error) {
    handleError(res, error, 'Error updating meal plan')
  }
}

// Delete a meal plan (Admin only)
const DeleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndDelete(req.params.id)
    if (!mealPlan) return res.status(404).send({ error: 'Meal plan not found' })
    res.send({ message: 'Meal plan deleted successfully' })
  } catch (error) {
    handleError(res, error, 'Error deleting meal plan')
  }
}

// Save selected meals
const SaveSelectedMeals = async (req, res) => {
  try {
    const { userId, meals } = req.body

    const existing = await SelectedMeal.findOne({ userId })
    if (existing) {
      const updatedMeals = [...new Set([...existing.meals, ...meals])]
      existing.meals = updatedMeals
      await existing.save()
      return res.status(200).send(existing)
    }

    const selectedMeals = await SelectedMeal.create({ userId, meals })
    res.status(201).send(selectedMeals)
  } catch (error) {
    handleError(res, error, 'Error saving selected meals')
  }
}

module.exports = {
  GetMealPlans,
  GetMealPlanById,
  CreateMealPlan,
  UpdateMealPlan,
  DeleteMealPlan,
  SaveSelectedMeals
}
