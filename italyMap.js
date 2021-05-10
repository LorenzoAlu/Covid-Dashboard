fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
.then(response=>response.json())
.then(dati=>{
    //definisco tutte le date
    allDate = Array.from(new Set(dati.map(el=>el.data)))

    //definisco valore range
    let dataRange = document.querySelector('#dataRange')
    dataRange.max= allDate.length - 1
    dataRange.value= allDate.length - 1
    
    //riempio tabella al caricamento della pagina con dati ultimo giorno
    let ActualValue = document.querySelector('#ActualValue')
    ActualValue.innerHTML = allDate[dataRange.value].split('T')[0].split('-').reverse().join('/')
    let Daily = choosenDate(dataRange.value)
    let tableBody = document.querySelector('#tableBody')
     tableBody.innerHTML=''
         Daily.forEach((el,i) => {
         let tr = document.createElement('tr')
         tr.innerHTML= 
         `
                     <th scope="row">${i}</th>
                     <td>${el.denominazione_regione}</td>
                     <td>${el.nuovi_positivi}</td>
                     <td>${el.dimessi_guariti}</td>
                     <td>${el.deceduti}</td>
         `                    
         tableBody.appendChild(tr)

         

         });
    
    //rendo dinamica tabella al variare del range
    dataRange.addEventListener('input',()=>{
        ActualValue.innerHTML = allDate[dataRange.value].split('T')[0].split('-').reverse().join('/')


       let Daily = choosenDate(dataRange.value)
       let tableBody = document.querySelector('#tableBody')
        tableBody.innerHTML=''
            Daily.forEach((el,i) => {
            let tr = document.createElement('tr')
            tr.innerHTML= 
            `
            
                        <th scope="row">${i}</th>
                        <td>${el.denominazione_regione}</td>
                        <td>${el.nuovi_positivi}</td>
                        <td>${el.dimessi_guariti}</td>
                        <td>${el.deceduti}</td>
                
            `                    
            tableBody.appendChild(tr)

            let maxPositive = Math.max(...Daily.map(el=>el.nuovi_positivi))
            let ActualRegion = region[i].getAttribute('data-regioni')
            let regionPositive = Daily.filter(el=>el.denominazione_regione ==  ActualRegion).map(el => el.nuovi_positivi)
            region[i].style.fill = `rgba(0, 4, 243, ${regionPositive/maxPositive})`
            });


    })

    //definisco funzione che mi filtra i dati aggiornati al giorno che scelgo
    function choosenDate(day=1) {
      return  dati.filter(el => el.data === allDate[day]) 
    }
    
   //riempio la mappa e faccio il modo che le regioni con piu positivi risultimo piu scure

   let region = document.querySelectorAll('[data-regioni')
   console.log(Daily)

   console.log(region[0].getAttribute('data-regioni'))

   Daily.forEach((el,i) => {
       let maxPositive = Math.max(...Daily.map(el=>el.nuovi_positivi))
       let ActualRegion = region[i].getAttribute('data-regioni')
       let regionPositive = Daily.filter(el=>el.denominazione_regione ==  ActualRegion).map(el => el.nuovi_positivi)
       region[i].style.fill = `rgba(0, 4, 243, ${regionPositive/maxPositive})`
   });


   // creo visualizzazione dei dati all hover 
   
   region.forEach(el=> {

        el.classList.add('.tooltip')
      el.addEventListener('click',function() {

          let tooltiptext=document.createElement('span')
          tooltiptext.classList.add('.tooltiptext')
          tooltiptext.innerHTML=`MERDA`

          el.appendChild(tooltiptext)
          console.log('okokok')

      })
   })

   //creo nuova mappa che mostri le morti totali
   

})