var db = require("./db/db");

module.exports = {
  addStockTicker: function (ticker) {
    var database = db.getDB();
    var collection = database.collection("tickers");
    var doc = {ticker: ticker};
    return new Promise(function(resolve, reject) {
      findEntry(doc, "tickers").then(function() {
        resolve();
      }, function() {
        collection.insert(doc);
        console.log(doc.ticker + " was added to the DB");
        resolve();
      }
      );
    });
  },
  addStock: function (stock) {
    var database = db.getDB();
    var collection = database.collection("stocks");
    //console.log(stock.Elements[0].Symbol);
    var doc = {
      ticker: stock.Elements[0].Symbol,
      data: stock
    };
    //console.log(doc.ticker);
    return new Promise(function(resolve1, reject1) {
      
    
      findEntry({ticker: doc.ticker}, "stocks").then(function(data) {
              // on resolve - remove previous stock data from database.
        collection.deleteOne(data, function(err, results) {
          if (err) console.log (err);
          //console.log(results + "was removed from the Database.");
        });
        return;
      },
      function() {console.log("rejected")}).then(function() {
        // add new stock data to database.
        collection.insert(doc);
        //console.log(doc + "Was inserted into the database.");
      }).then(function() {
        //console.log("inside final");
          collection.find({},{_id: 0}).toArray(function(err, docs) {
            if (err) console.log(err);
            //console.log("inside find");
            //console.log(docs);
            resolve1(docs);
        });
      });
    });
  },
  getAllStocks: function(returnData, collectionName) {
    //console.log("inside getAllStocks");
    switch (returnData) {
      case "ticker": var query = {_id: 0, ticker: 1};
    }
    var database = db.getDB();
    var collection = database.collection(collectionName);
    return new Promise(function(resolve, reject) {
      collection.find({}, query).toArray(function(err, docs) {
        if (err) console.log(err);
        //console.log("Inside getAllStocks");
        console.log(docs);
        resolve(docs);
      });
    });
  }
};

function findEntry(query, collectionName) {
  
  return new Promise (function (resolve, reject) {
    var database = db.getDB();
    var collection = database.collection(collectionName);
    collection.find(query).toArray(function (err, docs) {
      if (err) console.log(err);
      (docs.length > 0) ? resolve(docs[0]) : reject();    // if ticker exists in DB resolve, else reject.
    });
  });
}