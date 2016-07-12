"use strict";

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var request = require('request');
var stockDB = require("../models/stocks-model");
const API_PARAMETERS = {
          "Normalized": false,
          "NumberOfDays":365,
          "DataPeriod": "Day",
          "Elements" : [
              {
              //"Symbol": stockHistory[entry].ticker,
              "Type": "price",
              "Params": ["c"]
              }
          ]
        };

var jsonParser = bodyParser.json({type:"application/json"});

router.get("/", function(req, res) {
  res.redirect("./stocks.html");
});

router.post("/addNewTicker", jsonParser, function(req, res) {
  //var url = makeTickerURL(req.body.ticker);
  //stockDB.getAllStocks("ticker").then(function(stockHistory) {
  stockDB.addStockTicker(req.body.ticker).then(function() {
    stockDB.getAllStocks("ticker", "tickers").then(function(docs) {
      console.log(docs);
    })
  })
    
});

function makeTickerURL(ticker) {
  
  var output = API_PARAMETERS;
  output.Elements.Symbol = ticker;
  return output;
}

router.post("/getStockHistory", jsonParser, function(req, res) {
    
    /**This function takes a number of stock tickers requested by the application, 
     * sends out requests for data for each ticker, stores the data in a DB and then pipes the
     * trend data to the webpage.
     */
    
  stockDB.getAllStocks("ticker", "tickers").then(
    function(stockHistory) {
      //console.log(stockHistory);
      var baseUrl = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=";
      
      var url = {};
      var requestResult = [];
      
      for(var entry in stockHistory) {
  
        var parameters = makeTickerURL(stockHistory[entry].ticker);
        
        url.ticker = encodeURI(baseUrl + JSON.stringify(parameters));
  
        requestResult.push(sendRequest(url.ticker));
      }
      
      Promise.all(requestResult).then(function(data) {
        res.send(data[0]);
        res.end;
      }, function(data) {
          console.log("Failed some");
        }
      );
    }
  )}
);

function sendRequest(url) {

  return new Promise (function (resolve, reject) {
      request(url, function (error, response, body) {
        console.log("request made");
          if (!error && response.statusCode == 200) {
            stockDB.addStock(JSON.parse(body)).then(function (data){ 
              resolve(data);
            });
          }
        });
  });
}

module.exports = router;