USOF API
Overview
The USOF API is a backend system that supports user interaction and content management. It provides endpoints for managing users, posts, comments, categories, likes, dislikes, and user authentication. This API uses Node.js for backend logic, MySQL for database management, and Multer for handling file uploads. Authentication is implemented with JWT, and it includes features like email-based password recovery and post filtering/sorting.

Table of Contents
USOF API
Overview
Table of Contents
Features
Database Schema
Environment Variables
Installation and Setup
Available Scripts
API Documentation
Troubleshooting
Features
User Management:
User registration, login, profile updates, and avatar uploads.
Password recovery via email.
Post Management:
Create, update, and delete posts with optional file attachments.
Sorting and filtering by categories, likes, and dates.
Comments:
Add, edit, or delete comments linked to posts.
Likes/Dislikes:
Support for liking and disliking posts and comments.
Tracks like/dislike counts with real-time updates.
File Handling:
Handles user avatar uploads and post attachments with Multer.
Authentication:
Implements JWT-based authentication for secure user sessions.
Pagination:
Supports configurable pagination for posts and comments.
Database Schema
The database is structured relationally using MySQL and includes the following key tables:

Users: Stores user profiles and authentication data.
Posts: Contains user-generated posts.
Comments: Linked to posts for managing user comments.
Categories: Supports post categorization.
Likes: Tracks likes/dislikes for posts and comments.
Environment Variables
To configure the application, create a .env file in the root directory and define the following variables:

NODE_ENV: The environment mode (e.g., development or production).
PORT: Port number for the server.
DB_USER: MySQL database username.
DB_PASS: MySQL database password.
DB_NAME: MySQL database name.
DB_HOST: Hostname for the database.
DB_PORT: Port number for the database.
JWT_SECRET: Secret key for signing JWT tokens.
JWT_EXPIRATION: Token expiration time.
MAIL_HOST: SMTP host for sending emails.
MAIL_USER: SMTP email account username.
MAIL_PASS: SMTP email account password.
Installation and Setup


 
USOF API
USOF API is a Node.js application that serves as a backend for a user management and content system. It includes functionality for user authentication, content creation, and management of posts, comments, and likes.

Backend Installation
Clone the repository:
git clone https://github.com/ederros/usof.git
cd usof

Install the dependencies: npm install
Environment Variables
Create a .env file in the root of your project and add the following environment variables:

DB_HOST=localhost DB_USER=root DB_PASSWORD=12345678 DB_NAME=usof PORT=5050 MAIL=server@gmail.com MAIL_PASS=application_password JWT_SECRET=super_secret_code

Database Initialization
To set up the database, follow these steps:

Navigate to the sql folder:
cd sql

Execute the SQL initialization script via the command line:
Use the following command:

mysql -u your_username -p < db_init.sql

Database EER diagram

Running the Application
To start the API server, run the following command in the root directory of your project:

node app.js Your API should now be running on http://localhost:5050 or with another port what you are set in .env file.
Start the server:
bash
Clone the repository:
bash
 
git clone https://github.com/ederros/usof-frontend
Navigate to the project directory:
bash
 
cd usof
Install dependencies:
bash
 
npm install
Configure the .env file as described in the Environment Variables section.
Set up the database by running migrations and seeding:
bash

npm start
Available Scripts
npm start: Starts the production server.
npm run dev: Starts the development server with hot-reloading.
npm run db:migrate: Runs database migrations.
npm run db:seed: Seeds the database with initial data.
npm run db:reset: Resets the database by dropping and recreating tables.
npm run lint: Lints the codebase using ESLint.
npm run format: Formats the code using Prettier.
API Documentation
The API includes endpoints for managing users, posts, comments, and more. Detailed API documentation can be accessed when the server is running at /api-docs.

Troubleshooting
If you encounter issues:

Ensure the database is running and properly configured in .env.
Check server logs for error messages.
Verify that the required environment variables are set.
Ensure all dependencies are installed using npm install.
For additional support, open an issue on the project repository.