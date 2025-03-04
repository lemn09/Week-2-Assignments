/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require('body-parser');
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.use(bodyParser.json());

const Users = [];

let counter = 0;

// task1 : signup
app.post('/signup', (req, res) => {
  const givenUser = req.body;

  const existingUser = Users.filter((user) => user.email === givenUser.email);

  if (existingUser.length) {
    res.status(400).send('username already exists');
  } else {
    givenUser['id'] = ++counter;
    Users.push(givenUser);
    res.status(201).send("Signup successful")
  }
})

// task2 : login
app.post('/login', (req, res) => {
  const givenDetails = req.body;

  const user = Users.filter((user) => user.email === givenDetails.email && user.password === givenDetails.password);

  if (!user.length) {
    res.status(404).send('credentials are invalid');
  } else {
    const details = {
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      email: user[0].email
    }
    res.json(details);
  }

})

app.get('/data', (req, res) => {


  const check = Users.filter((user) => user.email === req.headers.email && user.password === req.headers.password);

  if (!check.length) {
    res.status(401).send('Unauthorized');
  } else {
    const users = [];
    Users.forEach((user) => {
      const currUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
      users.push(currUser);
    })

    res.json({ users });
  }
})

// app.listen(PORT, () => {
//   console.log('server is on');
// })

module.exports = app;
