const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Verificamos si hay una sesión activa
    if(req.session.authorization) {
        // Obtenemos el token de la sesión
        let token = req.session.authorization['accessToken'];
        
        // Verificamos si el token es válido
        jwt.verify(token, "access", (err, user) => {
            if(!err) {
                // Si todo está bien, lo dejamos pasar a la ruta con next()
                req.user = user;
                next();
            } else {
                // Si el token es viejo o falso, lo rebotamos
                return res.status(403).json({message: "User not authenticated"});
            }
        });
    } else {
        // Si ni siquiera hay sesión, lo rebotamos
        return res.status(403).json({message: "User not logged in"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
