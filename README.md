# The project

This is a slightly modified version of a back-end project I had to develop during my studies at the "Trybe" web development course. It is a Node API with which you can make CRUD operations for an online store. This project was made using Express.js and MongoDB. It also has unit tests for the models, services and controllers.

# Features

- [x] product creation endpoint
- [x] products listing endpoint
- [x] product editing endpoint
- [x] product deletion endpoint
- [x] sale creation endpoint
- [x] sales listing endpoint
- [x] sale editing endpoint
- [x] sale deletion endpoint
- [x] unit tests for models
- [x] unit tests for services
- [x] unit tests for controllers

# Getting started

This project requires Node.js and MongoDB.

## Installation

1. First, clone the repository:
- `git clone git@github.com:LucianoAAP/store-manager.git`
2. Then, enter the repository:
- `cd store-manager`
3. Finally, install dependencies:
- `npm install`

## Starting the application

1. First, start your MongoDB service:
- `sudo service mongod start`
2. Then, just run the application
- `npm start`

## Testing the application

- To run the integration tests, use `npm test`
- To run the tests and see the testing coverage report, use `npm run test:coverage`