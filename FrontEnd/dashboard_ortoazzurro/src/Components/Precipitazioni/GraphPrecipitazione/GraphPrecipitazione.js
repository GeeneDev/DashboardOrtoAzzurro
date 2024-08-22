import './GraphPrecipitazione.css';
import React from 'react';
import { LineChart } from '@mui/x-charts';

//Componente che mostra i dati delle precipitazioni su un grafico, utilizza mui/x-charts per la creazione del grafico 
//e prende in input i dati delle precipitazioni, larghezza (opzionale), altezza (obbligatoria con flexbox), pagina corrente, numero di elementi per pagina
const GraphPrecipitazione = ({ precipitazioneData, width, height , currentPage, itemsPerPage}) => {
    //Imposto i dati del grafico in base a quale pagina siamo e quanti oggetti da mostrare e
    //Sorting invertito dei dati delle perdite cosi da avere a sinistra i meno recenti ed a destra i piu' recenti
    //Ricostruisco anche i dati per il grafico in modo da avere un array di oggetti apprezzabile per il grafico
    const graphData = precipitazioneData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(item => ({
        lt_m2: item.lt_m2,
        temperatura: item.temperatura,
        data: item.data,
        nome: item.nome
      })).sort((a, b) => new Date(a.data) - new Date(b.data));

    //Imposto una griglia orizzontale sullo sfondo del grafico
    const otherSetting = {
      grid: { horizontal: true },
    };
    
    return (
      //Renderizzo il grafico con i dati manipolati precendentemente 
      <LineChart
            /* Assegno il dataset del grafico */
            dataset={graphData}
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
                  dataKey: 'temperatura', 
                  label: 'Temperatura ',
                  valueFormatter: (value) => `${value} °C`,
                  //Coloro di giallo la temperatura
                  color: '#ffa500',
                  area: true,
                },
                { 
                  dataKey: 'lt_m2', 
                  label: 'Precipitazione ',
                  valueFormatter: (value) => `${value} Lt/m²`,
                  //Coloro di azzurro le precipitazioni
                  color: '#2E96FF',
                  area: true,
                }
            ]}
            //Assegno le dimensioni del grafico
            width={width}
            height={height}
            //Applico la griglia orizzontale, che non sembra possibile impostare differentemente da questa modalita'
            {...otherSetting}
        />
        
      );
}

export default GraphPrecipitazione;