# TickPick

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

**For Event, we need to keep track of:**

1. Name - String and is required
2. Time and Date - Date and is required
3. Tick Count - Number, minimum of 0, and is required

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

![Entity relationship diagrams (ERD) ](./TickPick.png)

# wireframes

**First page:**

![First page](./firstpage.png)

**Second page:**

_if the user sign in or sign up it will sow to the user this page:_

![Second page](./Second%20page.png)

**Sign up:**

_To Create new account page:_

![Create new account page](./Fpage.png)

> Note: if the user click on sign up it will show the user this page.

**Sign in:**

![sign in](./sign%20in.png)

> Note: if the user click on sign in it will show the user this page.

**Third page:**

_After the user click on categories button it will show to the user this page:_

![Categories page](./Categorise.png)

**List of the events:**

_After the user select on one of the categories it will show to the user this page:_

![List of the Categories selected](./list.png)

**Information of the events:**

_After the user select on of the events it will show to the user this page:_

![Information of the events](./event%20info.png)

> Note: the user can buy the ticket from this page.

**Profile page:**

![profile page](./profile.png)

> Note: if the user click on edit button it will allow the user to edit the details.

![wireframe](./wireframe.png)

[Wireframe link](https://www.canva.com/design/DAGYVOanQ8A/eHEWSjQ8PFcfRaPrF6Oi4Q/edit?utm_content=DAGYVOanQ8A&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

# Tello

**We use Tello to organize our time and to make a clear plan:**
![todo list](image.png)

[Tello link](https://trello.com/b/WtBlCk2q/tickpick)

# USER TECHNOLOGY

- HTML
- JAVA SCRIPT
- CSS
- EJS
- NODE.JS

# NEXT STEP

1. make the user can select there own site in the stadium football.
2. make different tickets type.
3. make the application it compilable with different type of devices.