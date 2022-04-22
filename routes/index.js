const express = require('express');
const router = express.Router();

const isLogged = (req, res, next) => {
  if(!req.user) {res.json({msg: "You are not loggeed in"})}
  next();
}

/* GET home page. */
router.get('/', isLogged, function(req, res, next) {
  res.json({
    msg: "Index page",
    user: req.user
  })
});

module.exports = router;
