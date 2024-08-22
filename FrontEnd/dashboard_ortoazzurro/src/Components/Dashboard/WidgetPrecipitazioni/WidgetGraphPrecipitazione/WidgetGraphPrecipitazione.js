import './WidgetGraphPrecipitazione.css';
import React from 'react';
import { LineChart } from '@mui/x-charts';

//Componente che mostra i dati delle precipitazioni, temperatura e prodotti su un grafico, utilizza mui/x-charts per la creazione del grafico 
//e prende in input i dati aggregati, larghezza (opzionale), altezza (obbligatoria con flexbox), pagina corrente, numero di elementi per pagina e se mostrare l'area sottesa alle linee del grafico
const WidgetGraphPrecipitazione = ({  data, width, height , currentPage, itemsPerPage, areaToggle}) => {
    //Filtro i dati per la pagina corrente e numero di elementi per pagina
    const graphData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(item => ({
        lt_m2: item.lt_m2,
        temperatura: item.temperatura,
        data: item.data,
        nome: item.nome,
        //Riporto la produzione a Kpz (migliaia di pezzi) cosi' da poterli visualizzare nel grafico in maniera piu' intuitiva
        quantitaProduzione : (item.quantitaProduzione / 1000 ) || null
        //Sorting delle date dalla meno recente a sinistra alla piu' recente a destra
    })).sort((a, b) => new Date(a.data) - new Date(b.data));

    //Imposto una griglia orizzontale sullo sfondo del grafico
    const otherSetting = {
      grid: { horizontal: true },
    };
    
    return (
      /* Renderizzo il grafico con i dati manipolati precendentemente */
      <LineChart
            /* Assegno il dataset del grafico */
            dataset={graphData}
            /* Per l'asse x scelgo di mostrare il grafico per data */
            xAxis={[
                {
                  scaleType: 'band',
                  dataKey: 'data',
                  /* Formatto la data mostrando dd-mm-yyyy */
                  valueFormatter: (data) => `${ new Date(data).getDate()}-${new Date(data).getMonth() + 1}-${new Date(data).getFullYear()}`,
                },
            ]}
            /* Per l'asse y mostro le tre serie: produzione, temperatura e precipitazioni, in ordine inverso rispetto a come vorrei vedere le aree del grafico */
            series={[
              { 
                dataKey: 'quantitaProduzione', 
                label: 'Produzione (Kpz)',
                valueFormatter: (value) => `${value}`,
                /* Imposto il colore teal, lo stesso del default del grafico produzione per rendere omogeneo il look */
                color: '#02B2AF',
                /* Toggle dell'area sottesa alle linee del grafico */
                area: areaToggle,
                connectNulls: true,
              },
              { 
                dataKey: 'temperatura', 
                label: 'Temperatura ',
                valueFormatter: (value) => `${value} °C`,
                color: '#ffa500',
                /* Toggle dell'area sottesa alle linee del grafico */
                area: areaToggle,
              },
              { 
                dataKey: 'lt_m2', 
                label: 'Precipitazione ',
                valueFormatter: (value) => `${value} Lt/m²`,
                color: '#2E96FF',
                 /* Toggle dell'area sottesa alle linee del grafico */
                area: areaToggle,
              }
            ]}
             /* Se altezza e larghezza non vengono passati, il componente di mui/x-charts si occupa di impostare una dimensione di default del 100% per questo altezza e' obbligatoria con flexbox */
            width={width}
            height={height}
            /* Applico la griglia orizzontale, che non sembra possibile impostare differentemente da questa modalita' */
            {...otherSetting}
        />
      );
}

export default WidgetGraphPrecipitazione;