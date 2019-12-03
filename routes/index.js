var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.json(1,"Success","users");
});




module.exports = router;
