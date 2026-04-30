const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
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

public_users.post("/register", (req,res) => {
    // 1. Buscamos los datos en el CUERPO (body) de la petición
    const username = req.body.username;
    const password = req.body.password;
  
    // 2. Verificamos que el usuario haya escrito ambos campos
    if (username && password) {
      // 3. Verificamos que el usuario no exista ya en la base de datos
      if (!doesExist(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
    }
    // 4. Si faltó poner el usuario o la contraseña, tiramos error
    return res.status(404).json({message: "Unable to register user."});
  });

  // Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
    try {
      // Simulamos la demora de una base de datos real usando una Promesa
      const getBooks = await new Promise((resolve, reject) => {
          resolve(books);
      });
      
      // Devolvemos los libros con el formato prolijo
      return res.status(200).send(JSON.stringify(getBooks, null, 4));
    } catch (error) {
      return res.status(500).json({message: "Error fetching books"});
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  return res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const requestedAuthor = req.params.author;
  let foundBook = [];
  let bookKeys = Object.keys(books);
  bookKeys.forEach((key) => {
    if (books[key].author === requestedAuthor )
   {foundBook.push(books[key]);}
  }
    

  )
  return res.send(JSON.stringify(foundBook, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title;
    let foundBook = [];
    let bookKeys = Object.keys(books);
    bookKeys.forEach((key) => {
      if (books[key].title === requestedTitle )
     {foundBook.push(books[key]);}
    }
    )
    return res.send(JSON.stringify(foundBook, null, 4));
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn]
    if (book) {
        return res.send(book.reviews);
      } else {
        return res.status(404).json({message: "Book not found"});
      }
   });


module.exports.general = public_users;
