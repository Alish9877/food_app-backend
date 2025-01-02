const { MealPlan, SelectedMeal } = require('../models')
const mongoose = require('mongoose')

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
    if (!mealPlan) {
      return res.status(404).send({ error: 'Meal plan not found' })
    }
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
    if (!mealPlan) {
      return res.status(404).send({ error: 'Meal plan not found' })
    }
    res.send(mealPlan)
  } catch (error) {
    handleError(res, error, 'Error updating meal plan')
  }
}

// Delete a meal plan (Admin only)
const DeleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndDelete(req.params.id)
    if (!mealPlan) {
      return res.status(404).send({ error: 'Meal plan not found' })
    }
    res.send({ message: 'Meal plan deleted successfully' })
  } catch (error) {
    handleError(res, error, 'Error deleting meal plan')
  }
}

// Save selected meals
const SaveSelectedMeals = async (req, res) => {
  try {
    const { userId, selectedMeals } = req.body

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: 'Invalid userId' })
    }

    const validMeals = selectedMeals.filter((mealId) =>
      mongoose.Types.ObjectId.isValid(mealId)
    )

    if (validMeals.length !== selectedMeals.length) {
      return res
        .status(400)
        .send({ error: 'One or more meal IDs are invalid.' })
    }

    const objectIdMeals = validMeals.map(
      (mealId) => new mongoose.Types.ObjectId(mealId)
    )

    const existingSelection = await SelectedMeal.findOne({ userId })
    if (existingSelection) {
      existingSelection.meals = [
        ...new Set([...existingSelection.meals, ...objectIdMeals])
      ]
      await existingSelection.save()
      return res.status(200).send(existingSelection)
    }

    const newSelection = await SelectedMeal.create({
      userId: mongoose.Types.ObjectId(userId),
      meals: objectIdMeals
    })
    res.status(201).send(newSelection)
  } catch (error) {
    console.error('Error saving selected meals:', error)
    res.status(500).send({ error: 'Failed to save selected meals.' })
  }
}

const ImportExternalMealPlan = async (req, res) => {
  try {
    const { externalMeal } = req.body

    const existing = await MealPlan.findOne({ externalId: externalMeal.idMeal })
    if (existing) {
      return res.status(200).json(existing)
    }

    const mappedMealPlan = {
      name: externalMeal.strMeal,
      description: externalMeal.strInstructions
        ? externalMeal.strInstructions.slice(0, 100) + '...'
        : 'No instructions available',
      dishes: [externalMeal.strMeal],
      price: externalMeal.price || 10,
      category: externalMeal.strCategory || 'Misc',
      source: 'external',
      externalId: externalMeal.idMeal
    }

    const created = await MealPlan.create(mappedMealPlan)
    return res.status(201).json(created)
  } catch (error) {
    console.error('Error importing external meal:', error)
    res.status(500).send({ error: 'Failed to import external meal' })
  }
}

module.exports = {
  GetMealPlans,
  GetMealPlanById,
  CreateMealPlan,
  UpdateMealPlan,
  DeleteMealPlan,
  SaveSelectedMeals,
  ImportExternalMealPlan
}
