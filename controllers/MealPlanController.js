const { MealPlan } = require('../models')

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
    const { name, description, price, category, imageUrl } = req.body
    const mealPlanData = {
      name,
      description,
      price,
      category,
      image: imageUrl
        ? { url: imageUrl }
        : req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : null
    }
    const mealPlan = await MealPlan.create(mealPlanData)
    res.status(201).send(mealPlan)
  } catch (error) {
    handleError(res, error, 'Error creating meal plan')
  }
}

// Update an existing meal plan (Admin only)
const UpdateMealPlan = async (req, res) => {
  try {
    const { imageUrl } = req.body
    const updateData = {
      ...req.body,
      image: imageUrl
        ? { url: imageUrl }
        : req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : undefined
    }
    const mealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    )
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

// Import an external meal plan (optional integration with external APIs)
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
  ImportExternalMealPlan
}
