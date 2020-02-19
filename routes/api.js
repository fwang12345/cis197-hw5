var express = require('express')
var router = express.Router()
var Question = require('../models/question.js')

router.get('/questions', function(_, res, next) {
    // Find all questions and send in responses
    Question.find({}, function(err, result) {
        if (err) {
            next(err)
        }
        res.send(result)
    })
})

router.post('/questions/add', function(req, res, next) {
    var q = new Question(
        {
            author: req.session.username,
            questionText: req.body.question
        })
    q.save(function(err) {
        if (err) {
            next(err)
        } else {
            res.send({ success: 'OK'})
        }
    })
})

router.post('/questions/answer', function(req, res, next) {
    Question.updateOne({ _id: req.body.questionId }, 
        { answer: req.body.answer }, function(err) {
        if (err) {
            next(err)
        } else {
            res.send({ success: 'OK'})
        }
    })
})

module.exports = router
