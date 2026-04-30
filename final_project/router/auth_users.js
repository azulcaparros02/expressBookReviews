const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    // Filtramos el arreglo 'users' buscando uno que coincida exactamente con el usuario y la contraseña
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
    });
    
    // Si encontramos al menos un usuario válido, devolvemos true (verdadero)
    if (validusers.length > 0) {
      return true;
    } else {
      return false; // Si no coinciden, devolvemos false (falso)
    }
  }


  // Task 7: Login de usuario
regd_users.post("/login", (req,res) => {
    // 1. Agarramos usuario y contraseña del cuerpo de la petición
    const username = req.body.username;
    const password = req.body.password;
  
    // 2. Verificamos que no hayan mandado campos vacíos
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    // 3. Usamos la función authenticatedUser para validar las credenciales
    if (authenticatedUser(username, password)) {
        // Si son válidas, creamos el token JWT (la "llave" de acceso)
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 }); // El token dura 1 hora
  
        // Guardamos el token y el nombre de usuario en la sesión
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        // Si la contraseña o el usuario están mal, tiramos error
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // 1. Agarramos el ISBN de la URL
    const isbn = req.params.isbn;
    
    // 2. Buscamos el libro en nuestra base de datos
    let book = books[isbn];
  
    // 3. Verificamos si el libro existe
    if (book) {
        // Agarramos la reseña de la "query" (lo que va después del ? en la URL)
        let review = req.query.review;
        
        // Agarramos el nombre de usuario de la sesión que guardamos en el Login
        let username = req.session.authorization['username'];
  
        if(review) {
            // Acá ocurre la magia: 
            // Si el usuario no tenía reseña, la crea. Si ya tenía, la sobreescribe.
            book.reviews[username] = review;
            return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
        } else {
            return res.status(400).json({message: "Review is missing"});
        }
    }
    return res.status(404).json({message: "Book not found"});
  });

  // Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // 1. Agarramos el ISBN de la URL
    const isbn = req.params.isbn;
    
    // 2. Buscamos el libro
    let book = books[isbn];
  
    // 3. Verificamos si el libro existe
    if (book) {
        // Obtenemos el nombre del usuario de la sesión actual
        let username = req.session.authorization['username'];
  
        // Usamos el comando 'delete' de JavaScript para borrar específicamente la clave de ese usuario
        if (book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
        } else {
            return res.status(404).json({message: "You don't have a review for this book."});
        }
    }
    return res.status(404).json({message: "Book not found"});
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
