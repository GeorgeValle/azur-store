//import express from 'express';
import Router from 'express-promise-router';
const route = new Router();

import passport from 'passport';
import { logger, logInfo } from '../utils/Logger.js';

//enter in view home
route.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('home');
    } else {
        res.redirect('/session/purchase');
    }
});

//enter in view register
route.get('/register', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('signup');
    } else {
        res.redirect('/session/purchase');
    }
});

//create an user
route.post(
    '/register',
    passport.authenticate('register', {
        failureRedirect: 'failureRegister/',
    }),
    (req, res) => {
        logger.info(`se creó el usuario ${req.body.username} ruta session/register`);
        res.render('login');
    }
);

//enter in view login
route.get('/login', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('login');
    } else {
        res.redirect('/session/purchase');
    }
});

//login an user
route.post(
    '/login',
    passport.authenticate('login', { failureRedirect: 'failureLogin/' }),
    (req, res) => {
        logInfo.info('login successful');
        res.redirect('/session/purchase');
    }
);

//an admin input products in this view
route.get('/inputProduct', (req, res) => {
    if (req.isAuthenticated() && req.user.admin === true) {
        res.render('input-product', { user: req.user.name });
    } else {
        res.redirect('/');
    }
});

// enter en view logout
route.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        logger.info(`El usuario ${req.user.username} ha salido en ruta get logout`);
        res.render('logout', { user: req.user.name });
    } else {
        res.redirect('/session/login');
    }
});

//route for logout passport session
route.delete('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        return res.redirect('home/');
    });
});

// fail login view
route.get('/failureLogin', (req, res) => {
    logger.warn('intento fallido de inicio de sesión');
    res.render('fail-login');
});

// fail login view
route.post('/failureLogin', (req, res) => {
    res.render('fail-login');
});

// fail signup view
route.get('/failureRegister', (req, res) => {
    logger.error('intento fallido de registro');
    res.render('fail-register');
});

// fail signup view
route.post('/failureRegister', (req, res) => {
    res.render('fail-register');
});

//enter in the view purchase
route.get('/purchase', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    const access = req.user.admin === true;

    return res.render('purchase', {
        user: req.user.name,
        userId: req.user._id.toString(),
        avatar: req.user.avatar,
        admin: access,
        message: req.query.message || '',
    });
});

//enter in the view cart
route.get('/cart', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }

    const access = req.user.admin === true;

    return res.render('cart', {
        user: req.user.name,
        userId: req.user._id.toString(),
        admin: access,
    });
});

const sessionRouter = route;
export { sessionRouter };