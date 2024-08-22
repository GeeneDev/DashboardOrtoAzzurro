import './WidgetRicaviCosti.css';
import React from 'react';
import { getData } from '../../../Servizi/apiService';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';

//Componente widget per mostrare le vendite vs costi nel tempo e calcolare l'utile
const WidgetRicaviCosti = () =>{
    //Stato per salvare i dati da mostrare nel grafico
    const [graphDataset, setGrahpDataset] = useState([]);
    //Stato per salvare il numero di mesi da considerare nel grafico, inizializzata a 3 mesi
    const [numeroMesi, setNumeroMesi] = useState(3); 
    //Stato per memorizzare quanto e' l'utile nel data range considerato
    const [ricavoTotale, setRicavoTotale] = useState(0); 
    //Stato per memorizzare quanto e' il costo nel data range considerato
    const [costoTotale, setCostoTotale] = useState(0); 

    //All'avvio del componente viene richiamata la funzione fetchAllData per ottenere tutti i dati delle chiamate API attese tutte insieme
    //Viene chiamata anche quando cambia il numeroMesi
    useEffect(() => {
        const fetchAllData = async () => {
            //Istanzio una variabile di data alla data odierna con formato ISO senza orario
            let oggi = new Date().toISOString().split('T')[0];
            //Istanzio una variabile per alla data odierna, servira' per definire il data range di data di inizio per le chiamate
            let dataIniziale = new Date();
            //Manipolo la data sottraendone il numero di mesi considerati
            dataIniziale.setMonth(dataIniziale.getMonth() - numeroMesi);
            //Imposto la data in formato ISO e rimuovo l'orario
            dataIniziale = dataIniziale.toISOString().split('T')[0];

            try {
                //Effettuo tutte le chiamate e ne attendo tutte le risposte con await Promise.all passando come parametri le date definite precedentemente
                const [ricaviResult, costiResult] = await Promise.all([
                  getData(`/api/data/vendite?startDate=${dataIniziale}&endDate=${oggi}`),
                  getData(`/api/data/costi?startDate=${dataIniziale}&endDate=${oggi}`),
                ]);

                //Creo un oggetto per contenere i ricavi aggregati per data, utilizzo la data come chiave
                const ricaviAggregati = {};
                for (let item of ricaviResult) {
                    //Se la chiave non esiste la creo ed assegno i dati
                    if (!ricaviAggregati[item.data]) {
                        ricaviAggregati[item.data] = { data: item.data, valoreVendita: item.valoreVendita };
                    //Se la chiave esiste, sommo il valore della vendita
                    } else {
                        ricaviAggregati[item.data].valoreVendita += item.valoreVendita;
                    }
                }
                //Ricostruisco un array dal dataset aggregato
                const ricaviAggregatiArray = Object.values(ricaviAggregati);
                //Unisco i dati dei ricavi con quelli dei costi, separandoli in modo che il grafico possa apprezzarli
                const mergedData = ricaviAggregatiArray.map((item, index) => {
                    return {
                      ricavo: item.valoreVendita,
                      //Accorpo il costo del personale e il costo della perdita sui prodotti finiti in quanto mostrarli separatamente e' di piu' difficile interpretazione
                      costo: (costiResult[index].costoperdita + costiResult[index].costopersonale),
                      data: item.data,
                    };
                  });
                //Imposto i dati del grafico
                setGrahpDataset(mergedData);
                //Calcolo il totale dei ricavi utilizzando un accumulatore sui dati del grafico
                const totaleRicavi = mergedData.reduce((acc, entry) => acc + entry.ricavo, 0);
                //Calcolo il totale dei costi utilizzando un accumulatore sui dati del grafico
                const totaleCosti = mergedData.reduce((acc, entry) => acc + entry.costo, 0);
                //Imposto i dati dei ricavi totali
                setRicavoTotale(totaleRicavi);
                //Imposto i dati dei costi totali
                setCostoTotale(totaleCosti);
            } catch (errore) {
                console.error('Errore caricamento dati:', errore);
            }
        };
        //Eseguo effettivamente le operazioni
        fetchAllData();
    }, [numeroMesi]);

    //Funzione per cambiare il numero dei mesi
    const handleButtonClick = (value) => () => {
        setNumeroMesi(value);
    };

    return (
        /* Imposto il contenuto del componente */
        <div className='p-2 h-100'>
            <div className='border border-secondary bg-light h-100'>
                {/* Imposto l'intestazione */}
                <div className='row g-0'>
                    <div className='col-8'>
                      <div className='d-flex justify-content-center'>
                          <span className='fs-4'>Ricavi e Costi Aziendali ultimi {numeroMesi} mesi</span>
                      </div>
                    </div>
                    <div className='col-4'>
                        {/* Definisco i bottoni per il controllo dei mesi da mostrare e lo switch dell'area */}
                      <div className='d-flex justify-content-end pt-2 pe-2'>
                        <button type="button" className="btn btn-primary" onClick={handleButtonClick(3)}>3 mesi</button>   
                        <button type="button" className="btn btn-primary mx-2" onClick={handleButtonClick(6)}>6 mesi</button>    
                        <button type="button" className="btn btn-primary" onClick={handleButtonClick(12)}>12 mesi</button>   
                      </div>
                    </div>
                </div>
                {/* Appendo il grafico passando il dataset del grafico */}
                <div>
                    <BarChart
                        /* Assegno il dataset del grafico */
                        dataset={graphDataset}
                        /* Per l'asse x scelgo di mostrare il grafico per data */
                        xAxis={[
                            { 
                                scaleType: 'band', 
                                dataKey: 'data' ,
                                /* Formatto la data mostrando dd-mm-yyyy */
                                valueFormatter: (data) => `${ new Date(data).getDate()}-${new Date(data).getMonth() + 1}-${new Date(data).getFullYear()}`,
                            }
                        ]}
                        /* Per l'asse y mostro i costi e ricavi con colorazioni uguali a quelle del dettaglio, per rendere omogeneo il look */
                        series={[
                          { dataKey: 'ricavo', label: 'Ricavi', color: '#198754', valueFormatter: (value) => `${value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}`},
                          { dataKey: 'costo', label: 'Costi', color: '#dc3545',valueFormatter: (value) => `${value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}` },
                        ]}
                        /* Se altezza e larghezza non vengono passati, il componente di mui/x-charts si occupa di impostare una dimensione di default del 100% per questo altezza e' obbligatoria con flexbox */
                        height={300}
                    />
                </div>
                {/* Footer del componnte con vendite, costi ed utile */}
                <div className='row g-0 fs-4'>
                    <div className='col d-flex justify-content-center'>
                        <span>Vendite totali:</span>
                         {/* Il ricavoTotale viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='ms-2 text-success'>{ricavoTotale.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className='col d-flex justify-content-center'>
                        <span>Costi totali: </span>
                        {/* Il costoTotale viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='ms-2 text-danger'>{costoTotale.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                    <div className='col d-flex justify-content-center'>
                        <span>Utile: </span>
                        {/* l'utile calcolato comer ricavotoTotale-costoTotale viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='ms-2 text-success'>{(ricavoTotale-costoTotale).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WidgetRicaviCosti;