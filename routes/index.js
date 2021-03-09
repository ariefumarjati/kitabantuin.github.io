var express = require('express');
var router = express.Router();

var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
