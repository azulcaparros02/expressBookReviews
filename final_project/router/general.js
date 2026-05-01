const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Función para verificar si el usuario existe
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Ruta para registrarse (Tarea 6)
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
  .catch((err) => res.status(500).json({message: "Error fetching books"}));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) resolve(book);
    else reject("Book not found");
  })
  .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    let foundBooks = [];
    Object.keys(books).forEach((key) => {
        if (books[key].author === author) foundBooks.push(books[key]);
    });
    if (foundBooks.length > 0) resolve(foundBooks);
    else reject("Author not found");
  })
  .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    let foundBooks = [];
    Object.keys(books).forEach((key) => {
        if (books[key].title === title) foundBooks.push(books[key]);
    });
    if (foundBooks.length > 0) resolve(foundBooks);
    else reject("Title not found");
  })
  .then((data) => res.status(200).send(JSON.stringify(data, null, 4)))
  .catch((err) => res.status(404).json({message: err}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.send(JSON.stringify(book.reviews, null, 4));
  return res.status(404).json({message: "Book not found"});
});


const getAllBooksAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (err) { console.error(err); }
};

const getBookByISBNAxios = async (isbn) => {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return response.data;
    } catch (err) { console.error(err); }
};

const getBookByAuthorAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (err) { console.error(err); }
};

const getBookByTitleAxios = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return response.data;
    } catch (err) { console.error(err); }
};

module.exports.general = public_users;