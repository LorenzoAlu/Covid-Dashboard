
//faccio il fetch ddel json dei vaccini

fetch('https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/anagrafica-vaccini-summary-latest.json')
.then(response=>response.json())
.then(data =>{
    
  
    //trovo il totale vaccinati
    let totalVax = data.map(el => el)
    console.log(totalVax)
})