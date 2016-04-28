"use strict";

var express = require('express');

/*
var baseUrl = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=";
var parameters = {
    "Normalized": false,
    "NumberOfDays":365,
    "DataPeriod": "Day",
    "Elements" : [
        {
        "Symbol": "GOOGL",
        "Type": "price",
        "Params": ["c"]
        }
    ]
};
/*var parameters = {
    "Normalized":false,
    "NumberOfDays":365,
    "DataPeriod":"Day",
    "Elements":[
        {
            "Symbol":"AAPL",
            "Type":"price",
            "Params":["c"]
        }
    ]
};

var url = encodeURI(baseUrl + JSON.stringify(parameters));

console.log(url + "   " + JSON.stringify(parameters));

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body); // Show the HTML for the Google homepage.
  }
});
*/
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(require('./controllers/stocks.js'));

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});