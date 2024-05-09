const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
  
    // Return an error if the username or password is not provided.
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    // Creates an access token that is valid for 1 hour (60 X 60 seconds) and logs the user in, if the credentials are correct.
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else { // Throws an error, if the credentials are incorrect.
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const input_review = req.body.review;
  let book = books[isbn]
  let username = req.session.authorization.username;
  response = "Error"
  if (username){
    if (Object.keys(book.reviews).length > 0) {
      for (let key in book.reviews) {
        if (book.reviews.hasOwnProperty(key) && key === username) {
          book.reviews[key] = input_review;
          response = "Updated review for " + username
          return res.status(300).json({message: response});
        }
      }
    }
    book.reviews[username] = input_review;
    response = "Added review for " + username
  }
  return res.status(300).json({message: response});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn]
  let username = req.session.authorization.username;
  response = "Nothing is performed"
  if (username && Object.keys(book.reviews).length > 0){
    for (let key in book.reviews) {
      if (book.reviews.hasOwnProperty(key) && key === username) {
        delete book.reviews[key]
        response = "Deleted review for " + username
        break
      }
    }
  }
  return res.status(300).json({message: response});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
