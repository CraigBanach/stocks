
function drawChart(json) {

/** This function takes the chart data, parses it and then draws the chart to the specified div
 * @param {json} json - The data to be drawn in the chart, in JSON format
 */

  var chartData = [];
    for (var j = 0; j < json[0].data.Elements[0].DataSeries.close.values.length; j++) {
      var instanceData = {date: new Date(json[0].data.Dates[j])};
      for (var i = 0; i < json.length; i++) {
        instanceData[i] = json[i].data.Elements[0].DataSeries.close.values[j];
      }
    chartData.push(instanceData);
  }
  console.log(chartData);
        
  var graphData = {
    type: "stock",
    "theme": "light",
    "dataSets": [ {
      "fieldMappings": [],
      "dataProvider": chartData,
      "categoryField": "date"
    } ],

    "panels": [ {
      "stockGraphs": []
    } ],

    "chartScrollbarSettings": {
      "graph": "g1"
    },

    "chartCursorSettings": {
      "valueBalloonsEnabled": true,
      "fullWidth": true,
      "cursorAlpha": 0.1,
      "valueLineBalloonEnabled": true,
      "valueLineEnabled": true,
      "valueLineAlpha": 0.5
    },

    "periodSelector": {
      "position": "bottom",
      "periods": [ {
        "period": "MM",
        "selected": true,
        "count": 1,
        "label": "1 month"
      }, 
      {
        "period": "YYYY",
        "count": 1,
        "label": "1 year"
      }, 
      {
        "period": "YTD",
        "label": "YTD"
      }, 
      {
        "period": "MAX",
        "label": "MAX"
      } ]
    }
  };
  
  for (var i = 0; i < json.length; i++) {
    graphData.dataSets[0].fieldMappings.push({
      "fromField": i,
      "toField": "value" + i
    });
    graphData.panels[0].stockGraphs.push({
      "id": "g" + i,
      "title": "Graph #" + i,
      "lineThickness": 2,
      "valueField": "value" + i,
      "useDataSetColors": false
    });
  }
        
  var chart = AmCharts.makeChart( "chartdiv", graphData );
}

$(document).ready(function() {
  $("#addTickerButton").on("click", function() {
    addNewTicker($("#tickerInput").val());
  }
)})

function addNewTicker(ticker) {

  var url = "https://stocks-cragsify.c9users.io/addNewTicker";
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify({ticker: ticker}),
    accepts: "application/json",
    contentType: "application/json",
    dataType: "json",
    //error: function (data) {alert("error with button press")},
    success: function (data) {
      alert("button press success");
    }   
  });

}

function main() {
    
  var url = "https://stocks-cragsify.c9users.io/getStockHistory";
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify({tickers: {1: "GOOG", 2: "AAPL", 3: "AMZN", 4: "ppl"}}),
    accepts: "application/json",
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
      drawChart(data);
    }   
  });
}

main();