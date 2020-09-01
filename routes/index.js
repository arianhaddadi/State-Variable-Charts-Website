var express = require('express');
var router = express.Router();
// var variables ,nums;
/* GET home page. */

router.get("/draw",function(req,res,next){
  if (req.info){
    router.variables = req.info.variables;
    router.nums = req.info.nums;
    res.render("chart.html")
  }
  else {
    res.redirect("/");
  }
});

router.get("/signout",function(req,res,next){
  res.clearCookie("stats");
  res.redirect("/");
})

router.post("/get",function (req,res,next){
  res.json({
    vars:router.variables,
    num:router.nums
  })
})

router.get('/', function(req, res, next) {
  res.render('index.html');
});

module.exports = router;
