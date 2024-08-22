import './GraphProduzione.css';
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

//Componente che mostra i dati della produzione su un grafico, utilizza mui/x-charts per la creazione del grafico 
//e prende in input i dati della produzione, larghezza (opzionale), altezza (obbligatoria con flexbox), pagina corrente, numero di elementi per pagina
const GraphProduzione = ({ produzioneData, width, height , currentPage, itemsPerPage}) => {
    //Imposto i dati del grafico in base a quale pagina siamo e quanti oggetti da mostrare
    const graphData = produzioneData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    //Raggruppo i dati della produzione per data usando un accumulatore, per ottenere la somma delle quantità per data
    const groupedData = graphData.reduce((acc, curr) => {
     if (acc[curr.data]) {
         acc[curr.data] += curr.produzione.map(item => item.quantita).reduce((sum, val) => sum + val, 0);
     } else {
         const quantitaTotale = curr.produzione.map(item => item.quantita).reduce((sum, val) => sum + val, 0);
         acc[curr.data] = quantitaTotale;
     }
     return acc;
    }, {});
    //Ricostruisco l'array di dati dai dati raggruppati inserendo la data e la quantita
    const formattedGraphData = Object.entries(groupedData).map(([data, quantita]) => ({
        data: data, 
        quantita: quantita
    }));
    //Sorting delle date dalla meno recente a sinistra alla piu' recente a destra
    formattedGraphData.sort((a, b) => new Date(a.data) - new Date(b.data));

    //Imposto una griglia orizzontale sullo sfondo del grafico
    const otherSetting = {
      grid: { horizontal: true },
    };
    
    return (
        //Renderizzo il grafico con i dati manipolati precendentemente 
        <BarChart
            /* Assegno il dataset del grafico */
            dataset={formattedGraphData}
            xAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'data',
                  /* Formatto la data mostrando dd-mm-yyyy */
                  valueFormatter: (data) => `${ new Date(data).getDate()}-${new Date(data).getMonth() + 1}-${new Date(data).getFullYear()}`,
                  
                },
            ]}
            //Per l'asse y mostro una serie con i dati dei valori della produzione 
            series={[
                { 
                    dataKey: 'quantita', 
                    label: 'Produzione',
                    valueFormatter: (value) => `${value}`
                    //Il colore viene scelto quello di default
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

export default GraphProduzione;