import './GraphCosto.css';
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

//Componente che mostra i dati dei costi su un grafico, utilizza mui/x-charts per la creazione del grafico 
//e prende in input i dati dei costi, larghezza (opzionale), altezza (opzionale), pagina corrente e numero di elementi per pagina
const GraphCosto = ({ costoData, width, height, currentPage, itemsPerPage}) => {
    //Sorting dei dati all'inverso, dal meno recente a sinistra al piu' recente a destra
    const graphData = costoData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).sort((a, b) => new Date(a.data) - new Date(b.data));
    //Inverto il segno dei costi, dato che stiamo parlando di dati in negativo, cosi' il grafico mostrera' i dati verso il basso rispetto allo 0
    const graphDataArray = graphData.map((item) =>  ({...item, costo:  -1* Number(item.costo.toFixed(2))}));
    //Imposto una griglia orizzontale sullo sfondo del grafico
    const otherSetting = {
        grid: { horizontal: true },
    };

    return (
      /* Renderizzo il grafico con i dati manipolati precendentemente */
      <BarChart
          /* Assegno il dataset del grafico */
          dataset={graphDataArray}
          /* Per l'asse x scelgo di mostrare il grafico per data */
          xAxis={[
              {
                scaleType: 'band',
                dataKey: 'data',
                /* Formatto la data mostrando dd-mm-yyyy */
                valueFormatter: (data) => `${ new Date(data).getDate()}-${new Date(data).getMonth() + 1}-${new Date(data).getFullYear()}`,
              },
          ]}
          /* Per l'asse y scelgo di mostrare il grafico per costo */
          series={[
              { 
                dataKey: 'costo', 
                label: 'Costo',
                /* Il costo viene trasformato in tipologia monetaria con stile italiano  */
                valueFormatter: (value) => `${value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}  `,
                /* Imposto il colore rosso, lo stesso di boostrap text-danger per rendere omogeneo il look della pagina */
                color: '#dc3545'
              }
          ]}
          /* Se altezza e larghezza non vengono passati, il componente di mui/x-charts si occupa di impostare una dimensione di default del 100% */
          width={width}
          height={height}
          /* Nascondo la legenda */
          slotProps={{ legend: { hidden: true } }}
          /* Applico la griglia orizzontale, che non sembra possibile impostare differentemente da questa modalita' */
          {...otherSetting}
      />
    );
}

export default GraphCosto;