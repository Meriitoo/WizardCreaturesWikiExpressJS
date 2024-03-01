const router = require('express').Router();
const mongoose = require('mongoose');

const authService = require('../services/authService');
const { isAuth, isGuest } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorUtils');


router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest,  async (req, res) => {
    const { email, password}  = req.body; // this names are from name property field in login.hbs html 

    try{
        const token = await authService.login(email, password); //result from login it's gonna recieve token
        res.cookie('auth', token);
        res.redirect('/');
    }catch(error){
        return res.status(404).render('auth/login', { email, password,  error: getErrorMessage(error) }) //have to stop here when we return the status
    }
    
});

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const { firstName, lastName, email, password, repeatPassword} = req.body; //from register.hbs name property in html

    try{
        const token = await authService.register( firstName, lastName, email, password, repeatPassword);

        res.cookie('auth', token);
        res.redirect('/');
    }catch(error){
        res.status(400).render('auth/register', {firstName, lastName, email, password, error: getErrorMessage(error)});
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('auth');
    res.redirect('/');
});

module.exports = router;