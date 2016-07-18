"use strict";

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var request = require('request');
var stockDB = require("../models/stocks-model");
const BASEURL = "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters=";
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
      var promiseArray = [];
      console.log(docs);
      for (var entry in docs) {
        console.log(entry);
        var url = makeTickerURL(docs[entry].ticker);
        console.log(url);
        promiseArray.push(sendRequest(url));
      }
      Promise.all(promiseArray).then(function(data) {
        console.log(data);
        res.send(data[0]);
        res.end;
      }, function(data) {
          console.log("Failed some");
        }
      );
      
    });
  });
    
});

function makeTickerURL(ticker) {
  
  var output = API_PARAMETERS;
  output.Elements[0].Symbol = ticker;
  return encodeURI(BASEURL + JSON.stringify(output));
}

router.post("/getStockHistory", function(req, res) {
    
    /**This function takes a number of stock tickers requested by the application, 
     * sends out requests for data for each ticker, stores the data in a DB and then pipes the
     * trend data to the webpage.
     */
    
  stockDB.getAllStocks("ticker", "stocks").then(
    function(stockHistory) {
      //console.log(stockHistory);
      
      
      var url = {};
      var requestResult = [];
      
      for(var entry in stockHistory) {
  
        var parameters = makeTickerURL(stockHistory[entry].ticker);
        
        url.ticker = encodeURI(parameters);

        requestResult.push(sendRequest(parameters));
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
        if (error) {
          console.log(error);
        } else if (response.statusCode == 200) {
          stockDB.addStock(JSON.parse(body)).then(function (data){ 
              resolve(data);
            });
        } else {
          console.log(response.statusCode);
        }
    });
  }
)}

module.exports = router;