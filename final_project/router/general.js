const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "User name and / or password not provided."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const foundBooks = [];
  for (let key in books) {
    if (books.hasOwnProperty(key) && books[key].author === author) {
      foundBooks.push(books[key]);
    }
  }
  return res.status(300).json(foundBooks);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const foundBooks = [];
  for (let key in books) {
    if (books.hasOwnProperty(key) && books[key].title === title) {
      foundBooks.push(books[key]);
    }
  }
  return res.status(300).json(foundBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
