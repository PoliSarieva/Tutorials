const { isGuests } = require('../middlewares/guards');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router();

authController.get('/register',isGuests(), (req, res) => {
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register',isGuests(), async (req, res) => {
    try {
        if (req.body.username == '' || req.body.password == '') {
            console.log('required');
            throw new Error('All fields are required')
        }

        if (req.body.password.length < 5) {
            console.log('Password must be a long 5');
            throw new Error('Password must be a long 5 characters');
        }

        if (req.body.password != req.body.repass) {
            console.log('Password don/t match');
            throw new Error('Password don/t match');
        }
        const token = await register(req.body.username, req.body.password);

   
        res.cookie('token', token);
    
        res.redirect('/');
        
    } catch (error) {
        const errors = parseError(error);
        res.render('register', {
            title: 'Register Page',
            errors,
            body: {
                username: req.body.username
            }
        })
    }
});

authController.get('/login',isGuests(), (req, res) => {
    res.render('login',{ 
    title: 'Login page'})
});

authController.post('/login',isGuests(), async (req, res) => {
    try {
       const token = await login(req.body.username, req.body.password);

       res.cookie('token', token);
       res.redirect('/');
    } catch (error) {
        const errors = parseError(error);
        res.render('login',{ 
            title: 'Login page',
            errors,
            body: {
                username: req.body.username
            }
        })
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = authController;