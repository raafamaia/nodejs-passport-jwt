const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorHandler');

// Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

require('./models/Users');

// Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  app.use(errorHandler());
}

mongoose.connect(
  'mongodb://root:toor_000@ds145911.mlab.com:45911/nodejs-passport-jwt'
);
mongoose.set('debug', true);

require('./models/Users');
require('./config/passport');

app.use(require('./routes'));

const app = express();
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'passport-tutorial',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

app.listen(8000, () => console.log('Server running on http://localhost:8000'));
