
const express = require('express');
const router = express.Router();

const User = require('../models/user');
const { render } = require('ejs');

const userMiddleware = require('../Middlewares/userMiddleWare')


// Define a route for the login page

router.post('/user/login', async (req, res) => {

    const { email, password } = req.body;
    console.log(2);
    if (!email || !password) {
        res.render('login', { error: "invalid username and passaword" });
    }
    else {
        try {
            const user = await User.findOne({ email, password });
            if (user) {
                req.session.user = email
                console.log(req.session);
                res.redirect('/dashboard');
            }
            else {
                res.render('login', { error: 'Not registered' });
            }

        } catch (error) {
            console.log('Error logging in', error);
            res.render('login')
        }
    }


})

router.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard')
    } else {
        res.render('signup')
    }

})

router.post('/route/signup', async (req, res) => {
    console.log(5);
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword) {
        res.render('signup', { error: 'All fields are required' });
    }
    else if (password !== confirmPassword) {
        res.render('signup', { error: 'Password do not match' })
    }
    try {
        const checkUser = await User.find({ email: email })
        if (checkUser.length) {
            console.log(checkUser);
            return res.render('signup', { error: 'Email already exist!' })
        }
    } catch (error) {
        console.log(error);
        return res.render('signup', { error: error.message })

    }
    // else{
    try {
        const newUser = new User({ email, password });
        await newUser.save()   //save the user data

        if (req.session.adminUserCreated) {
            return res.redirect('/admin/dashboard')
        }
        res.redirect('/');

    } catch (error) {
        console.log(error);
        res.render('signup', { error: error.message })
    }

})



router.use(userMiddleware.isLoggedIn)

router.get('/', (req, res) => {
    res.redirect('/dashboard');
})

// route dashboard

router.get('/dashboard', (req, res) => {
    res.render('dashboard', { user: req.session.user });
})

// route signup



//route logout

router.get('/route/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.render('login')
    })

})






module.exports = router;



