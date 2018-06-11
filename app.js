var express = require('express'),
bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json());




app.get('/get', function (req, res, next) {
   let data = ['IceCream', 'Chocolates','Candy','Juice']
    res.json(data);
});

app.listen(9002, function () {
console.log('Example app listening on port 9002!');
});
