var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieSession = require('cookie-session')
var mongoose = require('mongoose')
var hbs = require('express-handlebars')

var Question = require('./models/question.js')
var accountRouter = require('./routes/account.js')
var apiRouter = require('./routes/api.js')

// instantiate express app...
var app = express()
// instantiate a mongoose connect call
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/hw5-new',
  { useNewUrlParser: true, useUnifiedTopology: true }
)

// set the express view engine to take care of handlebars within html files
app.engine('.hbs', hbs({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  cookieSession({
    name: 'local-session',
    keys: ['spooky'],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)

app.get('/', function (req, res, next) {
  Question.find({}, function (err, result) {
    if (err) {
      return next(err)
    }
    res.render('index', {
      user: req.session.username,
      questions: result,
      layout: false,
    })
  })
})


// TODO: set up post route that will
//       a) check to see if a user is authenticated
//       b) add a new question to the db
//       c) redirect the user back to the home page when done

app.post('/', function (req, res, next) {
  var questionText = req.body.question
  var q = new Question({ questionText: questionText })
  q.save(function (err) {
    if (!err) {
      res.redirect('/')
    } else {
      next(err)
    }
  })
})

// TODO: Set up account routes under the '/account' route prefix.
// (i.e. login should be /account/login, signup = /account/signup,
//       logout = /account/logout)

app.use('/account', accountRouter)

app.use('/api', apiRouter)


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Don't put any routes below here!
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Some browsers request the favicon (the little icon that shows up in the tab)
 * with every request, we just want to throw a 404 instead of any generic error
 */
app.get('/favicon.ico', function (_, res) {
  return res.status(404).send()
})

// Catch all for all other get requests
app.get('*', function (_, res) {
  return res.status(404).send()
})

// Middleware for catching any errors
app.use(function (err, _, res, _) {
  if (err) {
    return res.send('ERROR :  ' + err.message)
  }
})

/**
 * Now that the app is configured, start running the app. Print out to the
 * terminal/console where we can find the app.
 */
app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
