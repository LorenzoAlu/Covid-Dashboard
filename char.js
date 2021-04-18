

fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
    .then(response => response.json())
    .then(dati => {

        

        let sorted = dati
        let Days = Array.from(new Set(sorted.map(el=>el.data)))

        let DaysFormat =new Set(sorted.map(el=>el.data).map(x=>x.split("T")[0].split("-").reverse().join("/")))
        let TotalCase4DAys = Days.map(el=>[el.split("T")[0],sorted.filter(x=> x.data== el).map(y=>y=y.nuovi_positivi).reduce((t,n)=> t+n)])
        let Datachar = TotalCase4DAys.map(el=>{
            return{
                    'date' :el[0],
                    'value': el[1]
            }
        })


        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_material);
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdiv", am4charts.XYChart);

            // Add data
            chart.data = Datachar

            // Create axes
            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.location = 0;
            dateAxis.renderer.minGridDistance = 50;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            // Create series
            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value";
            series.dataFields.dateX = "date";
            series.strokeWidth = 3;
            series.fillOpacity = 0.5;

            // Add vertical scrollbar
            chart.scrollbarY = new am4core.Scrollbar();
            chart.scrollbarY.marginLeft = 0;

            // Add cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.behavior = "zoomY";
            chart.cursor.lineX.disabled = true;
        });


        
    })

//funzione custom che fa la differenza fra el[1] e el[0] per tutto l'arrey
function SingleData(array) {
    let final = [array[0]]
    let i = 1
    for (let i = 1; i < array.length; i++) {
        final.push(array[i] - array[i - 1]);
    }
    return final
}