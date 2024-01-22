const express = require('express');
const user = require('./routes/user');
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const nocache = require('nocache');
const mongoose = require('mongoose')
const app = express();


app.set('view engine','ejs');              // Set the view engine to EJS

app.use(nocache())

app.use(express.urlencoded({extended:true}));               //Parse URL-encoded bodies

app.use('/static',express.static(path.join(__dirname,'public')))              // Serve static files from 'public' directory
app.use('/assets',express.static(path.join(__dirname,'public/assets')))

app.use(session({
    secret:'thisismysecret',
    resave:false,
    saveUninitialized:false

    }))
    
    
app.use('/admin',admin)    
app.use('/',user);  
                   //Use the router middleware for all routes starting from '/'

mongoose.connect('mongodb://0.0.0.0:27017/employee', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    const port = 33000;
    app.listen(port, () => {
        console.log(`Listening to http://localhost:${port}`);
    });
})
.catch((e) => {
    console.error("Error connecting to MongoDB:", e.message);
});
