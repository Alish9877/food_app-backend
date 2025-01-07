# MealMate

## Background

- MealMate is a web-based food ordering system built using the MERN stack, designed to streamline the process of ordering and managing meals. The platform offers an intuitive interface where users can browse menus, choose their preferred meal plans, and customize their orders. Powered by Node.js and Express.js, the back-end ensures fast order processing and secure transactions, while MongoDB stores user data and order history. With a responsive front-end built in React, MealMate provides a seamless, user-friendly experience for selecting meals, entering delivery details, and completing payments. Whether for one-time orders or subscriptions, FoodieHub makes food delivery quick and easy.

## User Stories

- As a user i want to sign in to my account.
- As a user i want to create a new account, i can manage my Plans.
- As a user i want to choose my meals.
- As a user i want to view the list of meals.
- As a user i want to view meals details.
- As a user i want to see food categorized by perference.
- As a user i can add my delivery details , and add more than one address.
- As a user i can edit my profile.

## Entity relationship diagrams (ERD)

Entity relationship diagrams (ERDs) are a way to describe the data that will be used in an application. Using the user stories we created above, we know we must keep track of users and listings. Before considering the relationships between users and listings, let's consider what data we need to keep track of for each resource.

**For users, we need to keep track of:**

1. Username - String , required and unique
2. Username - String , required and unique
3. Password - String and required
4. Account type - enum (admin , user) and its defualt as a user


**For Subscription , we need to keep track of:**

1. StartDate - Date and required
2. Duration - Number (in months) and required
3. MealsPerDay - Enum (2 or 3) and required
4. Price - Number and required
5. Preferences - Array (List of Strings)

**For MealPlan, we need to keep track of:**

1. Name - String and required
2. Description - string
3. Dishes - Array (List of Strings)

**For Delivery, we need to keep track of:**

1. Delivery Date - Date and required
2. Status - Enum (Pending , Delivered) and required
3. Location - String and required
4. Meals - Array (List of Strings)

![Entity relationship diagrams (ERD) ](./photos/ERD.png)

# wireframes

**First page:**

![First page](./photos/Page1.png)

**Sign up:**

_To Create new account page:_

![Create new account page](./photos/signup.png)

> Note: if the user click on sign up it will show the user this page.

**Sign in:**

![sign in](./photos/Page2.png)

> Note: if the user click on sign in it will show the user this page.

**Third page:**

_Here is the Home Page:_

![Home page](./photos/Page3.png)

**List of the Melas:**

_After the user select the mealPlan button , it will show to the user the list of Meals:_

![List of the Meals](./photos/mealplan.png)

**Subscription Page:**

_After the user select on of the Meals and continue ,  it will show to the user Subscription Page:_

![Subscription Info](./photos/subscription.png)

**Delivery Page:**

_After the user add the subscription info , it will show to the user Delivery Page:_

![Address](./photos/delivery.png)

**DashBoard Page:**

_After the user add the subscription info , it will show to the user DashBoard Page, which is summary of the subscription:_

![Address](./photos/userDash.png)

**Profile page:**

_here the Account Setting Page, the user can edit his informartion as need:_

![profile page](./photos/accSet.png)


# Tello

**We use Tello to organize our time and to make a clear plan:**
![todo list](/photos/Trello.png)

[Tello link](https://trello.com/b/G5hQgnh9/foodapp)

# TECHNOLOGY USED

- MONGODB
- EXPRESS.JS
- REACT.JS
- NODE.JS

# NEXT STEP

1. More Plans , More Meals.
2. The users can pause their subscriptions.
3. The users can changes their Meals everyday.