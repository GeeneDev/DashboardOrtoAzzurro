import './GraphPerdita.css';
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

//Componente che mostra i dati delle perdite su un grafico, utilizza mui/x-charts per la creazione del grafico 
//e prende in input i dati delle perdite, larghezza (opzionale), altezza (obbligatoria con flexbox), pagina corrente, numero di elementi per pagina
const GraphPerdita = ({ perditaData, width, height, currentPage, itemsPerPage}) => {
    //Imposto i dati del grafico in base a quale pagina siamo e quanti oggetti da mostrare e
    //Sorting invertito dei dati delle perdite cosi da avere a sinistra i meno recenti ed a destra i piu' recenti
    const graphData = perditaData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).sort((a, b) => new Date(a.data) - new Date(b.data));
   
    //Costruisco un dataset con i dati per renderli apprezzabili dal grafico
    let dataMap = new Map();
    //Per ogni perdita nei dati ricevuti, utilizzo la data come chiave
    for(let perdita of graphData){
        //Se la perdita con chiave di data non esiste, creo l'oggetto con la data e il valore di perdita
        if(!dataMap.has(perdita.data)){
            dataMap.set(perdita.data, {data: perdita.data, valorePerdita: perdita.valorePerdita});
        //Se esiste aggioro il valore della perdita
        } else {
            let entry = dataMap.get(perdita.data);
            entry.valorePerdita += perdita.valorePerdita;
            dataMap.set(perdita.data, entry);
        }
    }
    //Ricostruisco un arrey dal dataset ed inverto il segno delle perdite, cosi' da avere i dati delle perdite in negativo
    const graphDataArray = Array.from(dataMap.values()).map((item) => ({...item, valorePerdita:  -1* Number(item.valorePerdita.toFixed(2))}));
    //Imposto una griglia orizzontale sullo sfondo del grafico
    const otherSetting = {
        grid: { horizontal: true },
    };

    return (
       // Renderizzo il grafico con i dati manipolati precendentemente 
      <BarChart
          /* Assegno il dataset del grafico */
          dataset={graphDataArray}
          //Per l'asse x scelgo di mostrare il grafico per data 
          xAxis={[
              {
                scaleType: 'band',
                dataKey: 'data',
                /* Formatto la data mostrando dd-mm-yyyy */
                valueFormatter: (data) => `${ new Date(data).getDate()}-${new Date(data).getMonth() + 1}-${new Date(data).getFullYear()}`,
              },
          ]}
          //Per l'asse y mostro una serie con i dati dei valori delle perdite 
          series={[
              { 
                dataKey: 'valorePerdita', 
                label: 'Perdita',
                //Il valore viene trasformato in tipologia monetaria con stile italiano
                valueFormatter: (value) => `${value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}`,
                //Assegno come colore lo stesso di text-danger della tabella per unificare il look
                color: '#dc3545'
              }
          ]}
          //Assegno le dimensioni del grafico e rimuovo la legenda per un'esperienza utente più fluida
          width={width}
          height={height}
          slotProps={{ legend: { hidden: true } }}
          //Applico la griglia orizzontale, che non sembra possibile impostare differentemente da questa modalita'
          {...otherSetting}
      />
    );
}

export default GraphPerdita;