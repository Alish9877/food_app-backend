require('dotenv').config()
const mongoose = require('mongoose')
const axios = require('axios')
const { MealPlan } = require('../models')

console.log('MealPlan Model:', MealPlan)

// Connect to MongoDB using the .env variable
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err))

// Fetch meals from external API
const fetchExternalMeals = async () => {
  try {
    const response = await axios.get(
      'https://www.themealdb.com/api/json/v1/1/search.php?s'
    )
    return response.data.meals
  } catch (err) {
    console.error('Error fetching external meals:', err)
    return []
  }
}

// Seed meals into the database
const seedExternalMeals = async () => {
  const meals = await fetchExternalMeals()

  if (!meals || meals.length === 0) {
    console.log('No meals found from the external API.')
    return
  }

  const mealDocs = meals.map((meal) => ({
    name: meal.strMeal,
    description: meal.strInstructions || 'No description available',
    dishes: [meal.strMeal],
    price: Math.floor(Math.random() * 15) + 5,
    category: meal.strCategory || 'Misc',
    source: 'external',
    externalId: meal.idMeal,
    image: { url: meal.strMealThumb }
  }))

  try {
    await MealPlan.insertMany(mealDocs)
    console.log(`${mealDocs.length} meals seeded successfully.`)
  } catch (err) {
    console.error('Error seeding external meals:', err)
  } finally {
    mongoose.connection.close()
  }
}

// Execute the seeder
const runSeeder = async () => {
  await seedExternalMeals()
}

runSeeder()
