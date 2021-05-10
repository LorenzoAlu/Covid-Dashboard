fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
    .then(response => response.json())
    .then(dati => {
        let sorted = dati.reverse();

        //Formattazione per mostrare data
        let lastUpdate = sorted[0].data
        let lastUpdateFormat = lastUpdate.split("T")[0].split("-").reverse().join("/")
        const lastDate = document.querySelector('#lastDate')
        let days = Array.from(new Set(sorted.map(el => el.data))).reverse()
        lastDate.innerHTML = lastUpdateFormat

        //filtro dati per ottenere gli ultimi dati della regione
        let lastDay = sorted.filter(el => el.data == lastUpdate).sort((a, b) => b.nuovi_positivi - a.nuovi_positivi)

        //trovo i casi totali
        let totalCases = lastDay.map(el => el.totale_casi).reduce((n, t) => n + t)
        const casiTotali = document.querySelector('#casiTotali')
        casiTotali.innerHTML = totalCases

        //trovo totale tamponi effettuati
        let TamponiTot = lastDay.map(el => el.tamponi).reduce((n, t) => n + t)
        const TotTamponi= document.querySelector('#TotTamponi')
        TotTamponi.innerHTML = TamponiTot


        //trovo i guariti totali
        let totalHealty = lastDay.map(el => el.dimessi_guariti).reduce((n, t) => n + t)
        const totaleGuariti = document.querySelector('#totaleGuariti')
        totaleGuariti.innerHTML = totalHealty

        //trovo i morti totali
        let totalDeath = lastDay.map(el => el.deceduti).reduce((n, t) => n + t)
        const mortiTotali = document.querySelector('#mortiTotali')
        mortiTotali.innerHTML = totalDeath

        //trovo i attualmente positivi 
        let totalPositive = lastDay.map(el => el.totale_positivi).reduce((n, t) => n + t)
        const totalePositivi = document.querySelector('#totalePositivi')
        totalePositivi.innerHTML = totalPositive


        //creo card delle regioni
        const cardWrapper = document.querySelector('#cardWrapper')
        const progressWrapper = document.querySelector('#progressWrapper')
        let maxValue = Math.max(...lastDay.map(el => el.nuovi_positivi))
        lastDay.forEach(el => {
            let div = document.createElement('div')
            div.classList.add('col-12', 'col-md-6', 'my-3')
            div.innerHTML =
                `
        <div class='col-md-12 card-custom-small p-3 my-3' data-region="${el.denominazione_regione}">
         <p class="text-start">${el.denominazione_regione}</p>
        <p class="text-end">Nuovi Positivi: ${el.nuovi_positivi}</p>
        </div>
        `
            cardWrapper.appendChild(div)

            let bar = document.createElement('div')
            bar.classList.add('col-12')
            bar.innerHTML =
                `
        <p>${el.denominazione_regione}: ${el.nuovi_positivi}</p>
        <div class="progress mb-4">
            <div class="progress-bar bg-main" style="width:${100 * (el.nuovi_positivi / maxValue)}%">

            </div>
        </div>
        `
            progressWrapper.appendChild(bar)
        });

        //definisco la modale e il suo contenuto
        const modal = document.querySelector('.modal-custom')
        const modalContent = document.querySelector('.modal-custom-content')

        //definisco contenuto delle varie modali
        document.querySelectorAll('[data-region').forEach(el => {
            el.addEventListener('click', () => {
                let region = el.dataset.region

                modal.classList.add('active')
                let regionData = lastDay.filter(el => el.denominazione_regione === region)[0]

                modalContent.innerHTML =
                    `
            <div class="row">
                <div class="col-12">
                    <div class="p-5">
                        <h3 class="mb-3">${region}</h3>
                        <p>Deceduti: ${regionData.deceduti}</p>
                        <p>Dimessi Guariti: ${regionData.dimessi_guariti}</p>
                        <p>Nuovi Positivi: ${regionData.nuovi_positivi}</p>
                        <p>Tamponi: ${regionData.tamponi}</p>
                        <p>Totale Casi: ${regionData.totale_casi}</p>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <p>Trend Nuovi Contagi</p>
                    <div id="trendNew" class="d-flex align-items-end border border-dark mt-5 plot">
                    </div>
                </div>

                <div class="col-12 mt-5">
                    <p>Trend Nuovi Morti Giornalieri</p>
                    <div id="trendDeath" class="d-flex align-items-end border border-dark mt-5 plot">
                </div>

                <div class="col-12 mt-5">
                    <p>Trend Nuovi Guariti Giornalieri</p>
                    <div id="trendRecovered" class="d-flex align-items-end border border-dark mt-5 plot">
                </div>
            </div>

            </div>

            `
                //definisco Array con i vari dati
                let TrendData = sorted.map(el => el).filter(el => el.denominazione_regione == region).filter(el => [el.data, el.nuovi_positivi, el.deceduti, el.dimessi_guariti]).reverse()
                let TrendDeathDiff = SingleData(TrendData.map(el => el.deceduti))
                let TrendRecoveredDiff = SingleData(TrendData.map(el => el.dimessi_guariti))


                //definisco valore max dei grafici
                let MaxTrendNew = Math.max(...TrendData.map(el => el.nuovi_positivi))
                let MaxTrendDeath = Math.max(...TrendDeathDiff.map(el => el))
                let MaxtrendRecovered = Math.max(...TrendRecoveredDiff.map(el => el))

                let trendNew = document.querySelector('#trendNew')
                let trendDeath = document.querySelector('#trendDeath')
                let trendRecovered = document.querySelector('#trendRecovered')

                //Creo grafici per ogni regione
                TrendData.forEach((el, index) => {
                    let colNew = document.createElement('div')
                    colNew.classList.add('d-inline-block', 'pinNew')
                    colNew.style.height = `${(el.nuovi_positivi / MaxTrendNew) * 100}%`

                    trendNew.appendChild(colNew)

                    let colDeath = document.createElement('div')
                    colDeath.classList.add('d-inline-block', 'pinDeath')
                    colDeath.style.height = `${100 * (TrendDeathDiff[index] / MaxTrendDeath)}%`

                    trendDeath.appendChild(colDeath)

                    let colRecovered = document.createElement('div')
                    colRecovered.classList.add('d-inline-block', 'pinRecovered')
                    colRecovered.style.height = `${(TrendRecoveredDiff[index] / MaxtrendRecovered) * 100}%`

                    trendRecovered.appendChild(colRecovered)

                })
            })
            //Funzione per chiudere la modale
            window.addEventListener('click', function (e) {
                if (e.target == modal)
                    modal.classList.remove('active')
            })
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

        //definisco nuova modale che si attiva alla pressione delle card
        let cardTotal = document.querySelector('#cardTotal')

        cardTotal.addEventListener('click', () => {
            modal.classList.add('active')
            modalContent.innerHTML =
        `
             <div class="row">
                 <div class="col-12">
                     <p>Casi Totali Giornalieri</p>
                     <div id="TrendCardTotal" class="d-flex align-items-end border border-dark mt-5 plot">
                     </div>
                 </div>
             </div>
        `
            //definisco nuovi positivi al giorno
            let dataCardTotalForDays = days.map(el => [el, sorted.filter(x => x.data == el).map(y => y.nuovi_positivi).reduce((t, n) => t + n)])
            let MaxdataCardTotalForDays = Math.max(...dataCardTotalForDays.map(el => el[1]))

            dataCardTotalForDays.forEach((el, index) => {
                let CardTotalCol = document.createElement('div')
                CardTotalCol.classList.add('d-inline-block', 'pinNew')
                CardTotalCol.style.height = `${(dataCardTotalForDays[index][1] / MaxdataCardTotalForDays) * 100}%`

                TrendCardTotal.appendChild(CardTotalCol)
            })
        })

        //definisco modale guariti 
        let cardRecovered =document.querySelector('#cardRecovered')

        cardRecovered.addEventListener('click', () => {
            modal.classList.add('active')
            modalContent.innerHTML =
        `
             <div class="row">
                 <div class="col-12">
                     <p>Casi Guariti Giornalieri</p>
                     <div id="TrendCardRecovered" class="d-flex align-items-end border border-dark mt-5 plot">
                     </div>
                 </div>
             </div>
        `
            //definisco nuovi positivi al giorno
            let dataCardRecoveredForDays = SingleData(days.map(el => [el, sorted.filter(x => x.data == el).map(y => y.dimessi_guariti).reduce((t, n) => t + n)]).map(el=>el[1]))
            let MaxdataCardRecoveredForDays = Math.max(...dataCardRecoveredForDays)

            dataCardRecoveredForDays.forEach((el) => {
                let CardRecoveredCol = document.createElement('div')
                CardRecoveredCol.classList.add('d-inline-block', 'pinRecovered')
                CardRecoveredCol.style.height = `${(el / MaxdataCardRecoveredForDays) * 100}%`

                TrendCardRecovered.appendChild(CardRecoveredCol)
            })
        })

        //definisco modale morti for days
        let cardDeath =document.querySelector('#cardDeath')

        cardDeath.addEventListener('click', () => {
            modal.classList.add('active')
            modalContent.innerHTML =
        `
             <div class="row">
                 <div class="col-12">
                     <p>Morti Giornalieri</p>
                     <div id="TrendcardDeath" class="d-flex align-items-end border border-dark mt-5 plot">
                     </div>
                 </div>
             </div>
        `
            //definisco nuovi positivi al giorno
            let datacardDeathForDays = SingleData(days.map(el => [el, sorted.filter(x => x.data == el).map(y => y.deceduti).reduce((t, n) => t + n)]).map(el=>el[1]))
            let MaxdatacardDeathForDays = Math.max(...datacardDeathForDays)


            datacardDeathForDays.forEach((el) => {
                let cardDeathCol = document.createElement('div')
                cardDeathCol.classList.add('d-inline-block', 'pinDeath')
                cardDeathCol.style.height = `${(el / MaxdatacardDeathForDays) * 100}%`

                TrendcardDeath.appendChild(cardDeathCol)
            })
        })

        //definisco modale nuovi positivi per days
        let cardIllness =document.querySelector('#cardIllness')

        cardIllness.addEventListener('click', () => {
            modal.classList.add('active')
            modalContent.innerHTML =
        `
             <div class="row">
                 <div class="col-12">
                     <p>Nuovi Positivi Giornalieri</p>
                     <div id="TrendcardIllness" class="d-flex align-items-end border border-dark mt-5 plot">
                     </div>
                 </div>
             </div>
        `
            //definisco nuovi positivi al giorno
            let datacardIllnessForDays = SingleData(days.map(el => [el, sorted.filter(x => x.data == el).map(y => y.deceduti).reduce((t, n) => t + n)]).map(el=>el[1]))
            let MaxdatacardIllnessForDays = Math.max(...datacardIllnessForDays)


            datacardIllnessForDays.forEach((el) => {
                let cardIllnessCol = document.createElement('div')
                cardIllnessCol.classList.add('d-inline-block', 'pinNew')
                cardIllnessCol.style.height = `${(el / MaxdatacardIllnessForDays) * 100}%`

                TrendcardIllness.appendChild(cardIllnessCol)
            })
        })

        //definisco modale tanponi per days
        let cardTamponi =document.querySelector('#cardTamponi')

        cardTamponi.addEventListener('click', () => {
            modal.classList.add('active')
            modalContent.innerHTML =
        `
             <div class="row">
                 <div class="col-12">
                     <p>Nuovi Tamponi Giornalieri</p>
                     <div id="TrendcardTamponi" class="d-flex align-items-end border border-dark mt-5 plot">
                     </div>
                 </div>
             </div>
        `
            //definisco nuovi positivi al giorno
            let datacardTamponiForDays = SingleData(days.map(el => [el, sorted.filter(x => x.data == el).map(y => y.tamponi).reduce((t, n) => t + n)]).map(el=>el[1]))
            let MaxdatacardTamponiForDays = Math.max(...datacardTamponiForDays)


            datacardTamponiForDays.forEach((el) => {
                let cardTamponiCol = document.createElement('div')
                cardTamponiCol.classList.add('d-inline-block', 'pinRecovered')
                cardTamponiCol.style.height = `${(el / MaxdatacardTamponiForDays) * 100}%`

                TrendcardTamponi.appendChild(cardTamponiCol)
            })
        })

    })

//faccio il fetch ddel json dei vaccini

fetch('https://raw.githubusercontent.com/italia/covid19-opendata-vaccini/master/dati/vaccini-summary-latest.json')
    .then(response => response.json())
    .then(data => {


        //trovo il totale vaccinati
        let totalVax = data.data.map(el => el.dosi_somministrate).reduce((n, t) => n + t)
        let totVaccini = document.querySelector('#TotVaccini')
        totVaccini.innerHTML = totalVax

      

        //definisco modale per numero vaccinati che contiene tutti i dati per regione
        let AllDataVax = Array.from(new Set(data.data))
        let cardVaxT = document.querySelector('#cardVaxT')

        //ridefinisco le modali perche sono in un altro scope
        const modal = document.querySelector('.modal-custom')
        const modalContent = document.querySelector('.modal-custom-content')

        cardVaxT.addEventListener('click', () => {
            modal.classList.add('active')
            modalContent.innerHTML=
            `
            <div class="text-center">               
            <h2> Dati Vaccini</h2>
            </div>
            <div id="VaxModalContent" class="row">
                
            </div>
            `

             //trovo percentuale vaccinati
            // const peopleItaly = 59641488
            // let percVax = ((totalVax / peopleItaly) * 100).toFixed(2)
            // let percVaccini = document.querySelector('#PercVaccini')
            // percVaccini.innerHTML = percVax + '%'

            AllDataVax.forEach(el=>{
                let cardVaxModal= document.createElement('div')
                cardVaxModal.classList.add('col-12','col-md-4','my-3')
                cardVaxModal.innerHTML=
                `
                <div class="card-custom p-4" style="height:300px">
                    <h4>${el.nome_area}</h4>
                    <p><strong>Dosi Somministrate</strong> ${el.dosi_somministrate} </p>
                    <p><strong>Dosi consegnate</strong> ${el.dosi_consegnate} </p>
                    <p><strong>Percentuale Somministrazione</strong> ${el.percentuale_somministrazione}% </p>
                </div>
                `
                VaxModalContent.appendChild(cardVaxModal)
            })

            //Funzione per chiudere la modale
            window.addEventListener('click', function (e) {
                if (e.target == modal)
                    modal.classList.remove('active')
            })

        })


    })