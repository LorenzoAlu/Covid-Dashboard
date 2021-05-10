

fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
.then(response => response.json())
.then(dati => {

    region = Array.from(new Set(dati.map(el=>el.denominazione_regione)))
    lastData = Array.from((new Set(dati.map(el => el.data)))).pop()
    lastDayDataDeath = dati.map(el=> el ).filter(x=>x.data === lastData).map(z=>[z.denominazione_regione,z.deceduti]).map(y=>{
        return{
            "Regione":y[0],
            "Deceduti":y[1]
        }})

console.log(lastDayDataDeath)

am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartdiv2", am4charts.PieChart);
    
    // Add data
    chart.data = lastDayDataDeath
    
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Deceduti";
    pieSeries.dataFields.category = "Regione";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.labels.template.disabled = true;
    pieSeries.innerRadius = am4core.percent(50)
    // pieSeries.ticks.template.disabled= true

    let label = pieSeries.createChild(am4core.Label);
    label.horizontalCenter = "middle";
    label.verticalCenter ="middle";
    label.fontSize = 35 ;
    label.text = "{values.value.sum}"






    
    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    
    }); 

})