//npm install  -to update installed packages

//middleware - anything btw the req and res e.g route-handlers
//install thirdparty middleware: npm i cors
require('dotenv').config();// .env needs to be access early as possible
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions.js');
const {logger,logEvents} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT'); //using JWT for combined routes
const cookieParser = require('cookie-parser'); //needed to control cookies on the backend
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn'); // import DB connection
const PORT = process.env.PORT || 5500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

//Handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);

//cors: cross origin resource sharing
app.use(cors(corsOptions));

//built-in middleware to handle urlencoded form data:
app.use(express.urlencoded({extended:false}));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/',express.static(path.join(__dirname,'/public')));

//using router middleware for subdir *important for router
app.use('/',require('./routes/root'));


app.use('/register',require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/refresh',require('./routes/refresh'));
app.use('/logout',require('./routes/logout'));

//only use JWT for users API routes
app.use(verifyJWT);
app.use('/users',require('./routes/api/users')); 

app.all('*',(req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error:'404 Not Found'});
    }else{
        res.type('txt').send('404 Not Found');
    }
});

//cors error handling
app.use(errorHandler);

// only want to listen for requests, when MongoDB is for sure connected
mongoose.connection.once('open',()=>{
    console.log('connected to MongoDB');
    app.listen(PORT,()=>{
        console.log(`server is running on port: ${PORT}`);
    });
})


