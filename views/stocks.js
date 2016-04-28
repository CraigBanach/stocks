function drawChart(json) {
    //json = JSON.parse(json);
    //console.log(json[0].data.Elements[0].DataSeries.close.values.length);
    var chartData = {};
    for (var i = 0; i < json.length; i++) {
        chartData[i] = [];
        for (var j = 0; j < json[i].data.Elements[0].DataSeries.close.values.length; j++) {
        chartData[i].push({date: new Date(json[i].data.Dates[j]), val: json[i].data.Elements[0].DataSeries.close.values[j]});
        }
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

    var chart = new AmCharts.AmStockChart();
    chart.pathToImages = "amcharts/images/";
    
    
    for (var i = 0; i < json.length; i++) {
        var dataSet = new AmCharts.DataSet();
        dataSet.dataProvider = chartData[i];
        dataSet.fieldMappings = [{fromField:"val", toField:"value"}];   
        dataSet.categoryField = "date";
        chart.dataSets.push(dataSet);
    }
    
    
    var stockPanel = new AmCharts.StockPanel();
    chart.panels = [stockPanel];

    var legend = new AmCharts.StockLegend();
    stockPanel.stockLegend = legend;                

    var panelsSettings = new AmCharts.PanelsSettings();
    panelsSettings.startDuration = 1;
    chart.panelsSettings = panelsSettings;   

    var graph = new AmCharts.StockGraph();
    graph.valueField = "value";
    graph.type = "line";
    graph.title = "MyGraph";
    graph.fillAlphas = 0;
    stockPanel.addStockGraph(graph);

    var graph2 = new AmCharts.StockGraph();
    graph2.valueField = "value";
    graph2.type = "line";
    graph2.title = "MyGraph";
    graph2.fillAlphas = 0;
    stockPanel.addStockGraph(graph2);

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

}

function main() {
    
    var url = "https://stocks-cragsify.c9users.io/getStockHistory";
   $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify({ticker: "GOOG"}),
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