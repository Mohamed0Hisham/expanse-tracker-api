4. Expense Tracker API
Difficulty: Easy

Skills and technologies used: Data modeling, user authentication (JWT).

Expense Tracker API

For the last of our “easy” backend projects, let’s cover one more API, an expense tracker API. This API should let you:

Sign up as a new user.
Generate and validate JWTs for handling authentication and user session.
List and filter your past expenses. You can add the following filters:
Past week.
Last month.
Last 3 months.
Custom (to specify a start and end date of your choosing).
Add new expenses.
Remove existing expenses.
Update existing expenses.
Let’s now add some constraints:

You’ll be using JWT (JSON Web Token) to protect the endpoints and to identify the requester.
For the different expense categories, you can use the following list (feel free to decide how to implement this as part of your data model):
Groceries
Leisure
Electronics
Utilities
Clothing
Health
Others.
As a recommendation, you can use MongoDB or an ORM for this project, such as Mongoose (if you’re using JavaScript/Node for this).

From everything you’ve done so far, you should feel pretty confident next time you have to build a new API.