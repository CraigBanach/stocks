function drawChart(json) {
    //json = JSON.parse(json);
    //console.log(json[0].data.Elements[0].DataSeries.close.values.length);
    var chartData = [];
        for (var j = 0; j < json[0].data.Elements[0].DataSeries.close.values.length; j++) {
        chartData.push({date: new Date(json[0].data.Dates[j]), val1: json[0].data.Elements[0].DataSeries.close.values[j], val2: json[1].data.Elements[0].DataSeries.close.values[j]});
        }
    console.log(chartData);
    //console.log(chartData);
       /* var chartData= [
            {date: new Date(2011, 5, 1, 0, 0, 0, 0), val:10},
            {date: new Date(2011, 5, 2, 0, 0, 0, 0), val:11},
            {date: new Date(2011, 5, 3, 0, 0, 0, 0), val:12},
            {date: new Date(2011, 5, 4, 0, 0, 0, 0), val:11},
            {date: new Date(2011, 5, 5, 0, 0, 0, 0), val:10},
            {date: new Date(2011, 5, 6, 0, 0, 0, 0), val:11},
            {date: new Date(2011, 5, 7, 0, 0, 0, 0), val:13},
            {date: new Date(2011, 5, 8, 0, 0, 0, 0), val:14},
            {date: new Date(2011, 5, 9, 0, 0, 0, 0), val:17},
            {date: new Date(2011, 5, 10, 0, 0, 0, 0), val:13}
        ];*/
        
        var chart = AmCharts.makeChart( "chartdiv", {
  type: "stock",
  "theme": "light",

  "dataSets": [ {
    "fieldMappings": [ {
      "fromField": "val1",
      "toField": "value1"
    }, {
      "fromField": "val2",
      "toField": "value2"
    } ],
    "dataProvider": chartData,
    "categoryField": "date"
  } ],

  "panels": [ {
    "stockGraphs": [ {
      "id": "g1",
      "title": "Graph #1",
      "lineThickness": 2,
      "valueField": "value1",
      "useDataSetColors": false
    }, {
      "id": "g2",
      "title": "Graph #2",
      "lineThickness": 2,
      "valueField": "value2",
      "useDataSetColors": false
    }]
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
    }, {
      "period": "YYYY",
      "count": 1,
      "label": "1 year"
    }, {
      "period": "YTD",
      "label": "YTD"
    }, {
      "period": "MAX",
      "label": "MAX"
    } ]
  }
} );
/*
    var chart = new AmCharts.AmStockChart();
    chart.pathToImages = "amcharts/images/";
    
    var stockPanel = new AmCharts.StockPanel();
        chart.panels = [stockPanel];

    
        var dataSet = new AmCharts.DataSet();
        dataSet.dataProvider = chartData;
        dataSet.fieldMappings = [{fromField:"val1", toField:"value"}];   
        dataSet.categoryField = "date";
        chart.dataSets.push(dataSet);
        console.log(dataSet);
        
        var graph = new AmCharts.StockGraph();
        graph.valueField = "value";
        graph.type = "line";
        graph.title = json[0].ticker;
        graph.fillAlphas = 0;
        stockPanel.addStockGraph(graph);
        
        var dataSet1 = new AmCharts.DataSet();
        dataSet1.dataProvider = chartData;
        dataSet1.fieldMappings = [{fromField:"val2", toField:"value"}];   
        dataSet1.categoryField = "date";
        chart.dataSets.push(dataSet1);
        console.log(dataSet1);
        
        var graph1 = new AmCharts.StockGraph();
        graph1.valueField = "value";
        graph1.type = "line";
        graph1.title = json[1].ticker;
        graph1.fillAlphas = 0;
        stockPanel.addStockGraph(graph1);
    
    
    

    var legend = new AmCharts.StockLegend();
    stockPanel.stockLegend = legend;                

    var panelsSettings = new AmCharts.PanelsSettings();
    panelsSettings.startDuration = 1;
    chart.panelsSettings = panelsSettings;   

    var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
    categoryAxesSettings.dashLength = 5;
    chart.categoryAxesSettings = categoryAxesSettings;

    var valueAxesSettings = new AmCharts.ValueAxesSettings();
    valueAxesSettings .dashLength = 5;
    chart.valueAxesSettings  = valueAxesSettings;

    var chartScrollbarSettings = new AmCharts.ChartScrollbarSettings();
    chartScrollbarSettings.graph = graph;
    chartScrollbarSettings.graphType = "line";
    chart.chartScrollbarSettings = chartScrollbarSettings;

    var chartCursorSettings = new AmCharts.ChartCursorSettings();
    chartCursorSettings.valueBalloonsEnabled = true;
    chart.chartCursorSettings = chartCursorSettings;

    var periodSelector = new AmCharts.PeriodSelector();
    periodSelector.periods = [{period:"DD", count:1, label:"1 day"},
                              {period:"DD",  count:5, label:"5 days"},
                              {period:"MM", count:1, label:"1 month"},
                              {period:"YYYY", count:1, label:"1 year"},
                              {period:"YTD", label:"YTD"},
                              {period:"MAX", selected:true, label:"MAX"}];                
    chart.periodSelector = periodSelector;
    chart.chartScrollbarSettings.enabled = false;

    chart.write("chartdiv");
*/
}

function main() {
    
    var url = "https://stocks-cragsify.c9users.io/getStockHistory";
   $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify({tickers: {1: "GOOG", 2: "AAPL"}}),
    accepts: "application/json",
    contentType: "application/json",
    dataType: "json",
    error: function() {alert("error");},
    success: function (data) {
        drawChart(data);
        }   
    });
}

main();