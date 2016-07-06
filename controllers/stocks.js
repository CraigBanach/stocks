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
    
    var parameters = {};
    var url = {};
    var requestResult = [];
    
    for(var ticker in req.body.tickers) {
     //console.log(ticker);

      parameters.ticker = {
        "Normalized": false,
        "NumberOfDays":365,
        "DataPeriod": "Day",
        "Elements" : [
            {
            "Symbol": req.body.tickers[ticker],
            "Type": "price",
            "Params": ["c"]
            }
        ]
      };
      
      url.ticker = encodeURI(baseUrl + JSON.stringify(parameters.ticker));
      //console.log(url.ticker);
      requestResult.push(sendRequest(url.ticker));
    }
    
    Promise.all(requestResult).then(function(data) {
      console.log(data[0]);
      res.send(data[0]);
      res.end;
    }, function(data) {
        console.log("Failed some");
      }
    );
    
    
    //console.log(url + "   " + JSON.stringify(parameters));
    /*
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        stockDB.addStock(JSON.parse(body)).then(function (data){ 
          console.log(data);
          res.send(data);
          res.end;  
        });
      }
    });
    */
});

function sendRequest(url) {


  return new Promise (function (resolve, reject) {
      request(url, function (error, response, body) {
        console.log("request made");
          if (!error && response.statusCode == 200) {
            stockDB.addStock(JSON.parse(body)).then(function (data){ 
              resolve(data);
              /*
              console.log(data);
              res.send(data);
              res.end;  
              */
            });
          }
        });
  });
}

module.exports = router;