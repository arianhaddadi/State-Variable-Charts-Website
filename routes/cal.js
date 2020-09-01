var express = require('express');
var router = express.Router();


function stateVar (t,a,x,b,i,n) {
  var A = [];
  var s = i * n;
  for ( var j = s ; j < n + s ; j++ ) {
    A.push(a[j] * t)
  }
  this.no = i+1;
  this.AT = A;
  this.B = b*t;
  this.X0 = x;
}


function prepareInt(A){
  var data = [];
  for ( var i = 0 ; i < A.length ; i ++ ) {
    data.push(parseFloat(A[i]));
  }
  return data;
}


router.post('/', function(req, res, next) {
  var b = req.body;
  var v;
  b.nums = parseInt (b.nums);
  b.T = parseFloat(b.T);
  b.A = prepareInt(b['A[]']);
  b.XZ = prepareInt(b['XZ[]']);
  b.B = prepareInt(b['B[]']);
  var varies = [];
  for ( var i = 0 ; i < b.nums ; i++ ) { 
    v = new stateVar(b.T, b.A, b.XZ, b.B[i], i, b.nums);
    varies.push(v);
  }
  res.cookie("stats",JSON.stringify({
    variables:varies,
    nums:b.nums
  }));
  res.json({
    message:"lets go"
  });
});

module.exports = router;
