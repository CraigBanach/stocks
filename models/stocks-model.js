var db = require("./db/db");

module.exports = {
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
      
    
      findEntry({ticker: doc.ticker}).then(function(data) {
              // on resolve - remove previous stock data from database.
        collection.deleteOne(data, function(err, results) {
          if (err) console.log (err);
          console.log(results + "was removed from the Database.");
        });
        return;
      },
      function() {console.log("rejected")}).then(function() {
        // add new stock data to database.
        collection.insert(doc);
        console.log(doc + "Was inserted into the database.");
      }).then(function() {
        console.log("inside final");
          collection.find({},{_id: 0}).toArray(function(err, docs) {
            if (err) console.log(err);
            //console.log("inside find");
            console.log(docs);
            resolve1(docs);
        });
      });
    });
  }
};

function findEntry(query) {
  
  return new Promise (function (resolve, reject) {
    var database = db.getDB();
    var collection = database.collection("stocks");
    collection.find(query).toArray(function (err, docs) {
      if (err) console.log(err);
      (docs.length > 0) ? resolve(docs[0]) : reject();    // if ticker exists in DB resolve, else reject.
    });
  });
}