import './GraphVendita.css';
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

//Componente che mostra i dati delle vendite su un grafico, utilizza mui/x-charts per la creazione del grafico 
//e prende in input i dati delle vendite, larghezza (opzionale), altezza (obbligatoria con flexbox), pagina corrente, numero di elementi per pagina
const GraphVendita = ({ venditaData, width, height, currentPage, itemsPerPage}) => {
    //Imposto i dati del grafico in base a quale pagina siamo e quanti oggetti da mostrare
    //ed eseguo il sorting dei dati dalla data meno recente a sinistra alla data piu' recente a destra
    const graphData = venditaData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).sort((a, b) => new Date(a.data) - new Date(b.data));
    //Raggruppo i dati per l grafico in un dataset usando come chiave la data di vendita
    let dataMap = new Map();
    for(let vendita of graphData){
        //Se la data non è presente nel dataset la aggiungo altrimenti sommo il valore di vendita
        if(!dataMap.has(vendita.data)){
            dataMap.set(vendita.data, {data: vendita.data, valoreVendita: vendita.valoreVendita});
        } else {
            let entry = dataMap.get(vendita.data);
            entry.valoreVendita += vendita.valoreVendita;
            dataMap.set(vendita.data, entry);
        }
    }
    //Ricostruisco l'array di dati dai dati raggruppati in modo che il grafico possa apprezzarli
    const graphDataArray = Array.from(dataMap.values()).map((item) => ({...item, valoreVendita: Number(item.valoreVendita.toFixed(2))}));
    //Imposto una griglia orizzontale sullo sfondo del grafico
    const otherSetting = {
        grid: { horizontal: true },
    };

    return (
       //Renderizzo il grafico con i dati manipolati precendentemente 
      <BarChart
          /* Assegno il dataset del grafico */
          dataset={graphDataArray}
          xAxis={[
              {
                scaleType: 'band',
                dataKey: 'data',
                /* Formatto la data mostrando dd-mm-yyyy */
                valueFormatter: (data) => `${ new Date(data).getDate()}-${new Date(data).getMonth() + 1}-${new Date(data).getFullYear()}`,
              },
          ]}
          //Per l'asse y mostro una serie con i dati dei valori delle vendite 
          series={[
              { 
                dataKey: 'valoreVendita', 
                label: 'Vendita',
                //Il valore vendita dell'entry viene trasformato in tipologia monetaria con stile italiano
                valueFormatter: (value) => `${value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}`,
                //Setto il colore come text-success di bootstrap per unificare il look della pagina
                color: '#198754'
              }
          ]}
          //Assegno le dimensioni del grafico
          width={width}
          height={height}
          //Nascondo la legenda in quanto superflua in questo grafico
          slotProps={{ legend: { hidden: true } }}
          //Applico la griglia orizzontale, che non sembra possibile impostare differentemente da questa modalita'
          {...otherSetting}
      />
    );
}

export default GraphVendita;