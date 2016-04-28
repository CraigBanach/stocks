"use strict";

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var request = require('request');
var stockDB = require("../models/stocks-model");
//var session = require('express-session');
//var userDB = require("../models/users");

var jsonParser = bodyParser.json({type:"application/json"});

router.get("/", function(req, res) {
  res.redirect("./stocks.html");
});

router.post("/getStockHistory", jsonParser, function(req, res) {
    //console.log(req.body.ticker);
    
    var baseUrl = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=";
    var parameters = {
        "Normalized": false,
        "NumberOfDays":365,
        "DataPeriod": "Day",
        "Elements" : [
            {
            "Symbol": req.body.ticker,
            "Type": "price",
            "Params": ["c"]
            }
        ]
    };


    var url = encodeURI(baseUrl + JSON.stringify(parameters));
    
    //console.log(url + "   " + JSON.stringify(parameters));
    
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        stockDB.addStock(JSON.parse(body)).then(function (data){ 
          console.log(data);
          res.send(data);
          res.end;  
        });
      }
    });
});

module.exports = router;