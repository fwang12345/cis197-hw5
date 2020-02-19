var express = require('express')
var router = express.Router()
var User = require('../models/user.js')
var isAuthenticated = require('../middlewares/isAuthenticated.js')
router.get('/signup', function(req, res) {
    res.render('signup', {
        layout: false,
    })
})

router.post('/signup', function(req, res, next) {
    User.find({username: req.body.username}, function(err, result) {
        if (err) {
            return next(err)
        }
        // Save user only if it does not already exist
        if (!result.length) {
            var u = new User({ 
                username: req.body.username,
                password: req.body.password
            })
            u.save(function(err) {
                if (err) {
                    return next(err)
                }
            })
        }
        res.redirect('/account/login')
    })
})

router.get('/login', function(req, res) {
    res.render('login', {
        layout: false,
    })
})

router.post('/login', function(req, res, next) {
    User.find(
        {
            username: req.body.username, 
            password: req.body.password
        }, function(err, result) {
        if (err) {
            return next(err)
        }
        // If there is a user, redirect to index
        if (result.length) {
            req.session.username = req.body.username
            res.redirect('/')
        } else {
            return next(err)
        }
    })
})

router.get('/logout', isAuthenticated, function(req, res) {
    // Reset session and redirection to index  
    req.session = null
    res.redirect('/')
})

module.exports = router
