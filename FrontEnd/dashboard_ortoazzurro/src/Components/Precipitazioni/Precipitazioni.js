import './Precipitazioni.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TablePrecipitazione from './TablePrecipitazione/TablePrecipitazione';
import GraphPrecipitazione from './GraphPrecipitazione/GraphPrecipitazione';
import IsLoading from '../IsLoading/isLoading';

//Componente per la visualizzazione delle perdite incorse dall'azienda
//Diviso in tre parti: il componente principale, un grafico e una tabella che mostrano i dati delle perdite
const Precipitazioni = () => {
    //Stato per memorizzare i dati delle precipitazioni
    const [precipitazioni, setPrecipitazioni] = useState([]);
    //Stato per memorizzare la pagina corrente, impostata a default a 1
    const [currentPage, setCurrentPage] = useState(1);
    //Variabile per indicare quanti oggetti mostrare per pagina e grafico
    const itemsPerPage = 20;
    //Variabile per indicare quante sono le pagine massime (numero dei dati nelle precipitazioni / quanti oggetti da mostrare per pagina)
    const maxPages = Math.ceil(precipitazioni.length / itemsPerPage);
    //Stato per gestire il caricamento dei dati, permette di attendere in maniera graziosa il caricamento
    const [isLoading, setIsLoading] = useState(true);
    //Stato per memorizzare i nomi delle precipitazioni, usato dal select del filtro per precipitazione
    const [nomiPrecipitazioni, setNomiPrecipitazioni] = useState([]); 
    //Stato per memorizzare il nome della precipitazione selezionata, usato dal filtro per precipitazione, inizializzato a Tutti
    const [selectedNome, setSelectedNome] = useState('Tutti'); 
    //Stato per gestire il filtro per la data di inizio dei dati
    const [daDataValue, setDaDataValue] = useState(dayjs('2000-01-01'));
    //Stato per gestire il filtro per la data di fine dei dati
    const [aDataValue, setADataValue] = useState(dayjs(new Date()));
    //Stato per memorizzare da quale temperatura si parte nel filtro per temperatura
    const [daTemperaturaValue, setDaTemperaturaValue] = useState('');
    //Stato per memorizzare a quale temperatura si vuole arrivare nel filtro per temperatura
    const [aTemperaturaValue, setATemperaturaValue] = useState('');
    //Stato per memorizzare il valore minimo del volume di litri per metro quadro nel filtro per litri
    const [daLtm2Value, setDaLtm2Value] = useState('');
    //Stato per memorizzare il valore massimo del volume di litri per metro quadro nel filtro per litri
    const [aLtm2Value, setALtm2Value] = useState('');

    //All'avvio del componente viene richiamata la funzione fetchDataPerdite per ottenere i dati
    //Viene chiamata anche quando cambiano le variabili daDataValue, aDataValue,daTemperaturaValue,aTemperaturaValue,daLtm2Value,aLtm2Value,selectedNome per eseguire i filtri
    useEffect(() => {
        const fetchDataPrecipitazioni = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultPrecipitazioni = await getData('/api/data/precipitazioni');
            //Sorting dei dati dal piu recente al piu lontano
            resultPrecipitazioni.sort((a, b) => new Date(b.data) - new Date(a.data));
             //Creo un dataset con i nomi delle precipitazioni che si vogliono poter filtrare
            const nomiPrecipitazioniSet = new Set();
            resultPrecipitazioni.forEach((item) => {
              nomiPrecipitazioniSet.add(item.nome);
            });
            const nomiPrecipitazioniArray = Array.from(nomiPrecipitazioniSet);
            //Sorting dei nomi delle precipitazioni in ordine alfabetico
            nomiPrecipitazioniArray.sort((a, b) => a.localeCompare(b));
            //Imposto in nomi delle precipitazioni
            setNomiPrecipitazioni(nomiPrecipitazioniArray);
            //Preparo i filtri sui dati
            let filteredData = resultPrecipitazioni;
            //Se il filtro da data a data e' valorizzato, filtro i dati per quel datarange
            if(daDataValue && aDataValue){
              filteredData = filteredData.filter((precipitazione) => 
                new Date(precipitazione.data) >= daDataValue && new Date(precipitazione.data) <= aDataValue
              );
            }
             //Se ho un valore di partenza per litri per metro quadro o un numero di fine per litri per metro quadro, filtro i dati per quel range litri per metro quadro
            if(daLtm2Value || aLtm2Value){
              filteredData = filteredData.filter((precipitazione) =>
                (!daLtm2Value || precipitazione.lt_m2 >= daLtm2Value) && 
                (!aLtm2Value || precipitazione.lt_m2 <= aLtm2Value)
              ); 
            }
            //Se ho una temperatura di partenza o una temperatura di fine, filtro i dati per quel range di temperature
            if(daTemperaturaValue || aTemperaturaValue){
              filteredData = filteredData.filter((precipitazione) =>
                (!daTemperaturaValue || precipitazione.temperatura >= daTemperaturaValue) && 
                (!aTemperaturaValue || precipitazione.temperatura <= aTemperaturaValue) 
              );
            }
            //Se ho selezionato un nome precipitazione che non sia tutti, filtro i dati per quel nome
            if(selectedNome !== 'Tutti'){
              filteredData = filteredData.filter((precipitazione) => precipitazione.nome === selectedNome);
            }
            //Setto i dati filtrati (oppure non filtrati) da renderizzare
            setPrecipitazioni(filteredData);
            //Imposto la prima pagina come pagina da visualizzare
            setCurrentPage(1);
          } catch (errore) {
            console.error('Errore caricamento dati precipitazioni:', errore);
          }
          finally {
            //Imposto loading a falso, cosi' da mostrare i dati solo quando sono pronti
            setIsLoading(false);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataPrecipitazioni();
        //L'UseEffect verra' ricalcolato al cambio di queste variabili
      }, [daDataValue, aDataValue,daTemperaturaValue,aTemperaturaValue,daLtm2Value,aLtm2Value,selectedNome]);

    //Rendering del componente
    return (
        <div className="m-4">
          <h3>Precipitazioni</h3>
          <div className='d-flex justify-content-center'>
            <div className='card px-4 fit-content'>       
              {isLoading ?  (
                /* Se stiamo attendendo la fine del carcamento dati, mostro il componente di caricamento */
                <IsLoading/>
              ) : (
                <>
                 {/* In cima alla pagina mostro il grafico delle precipitazioni passando come parametri i dati delle precipitazioni, la pagina corrente, il numero di oggetti da motrare per pagina e l'altezza*/}
                  <div className='ms-4'>
                    <GraphPrecipitazione precipitazioneData={precipitazioni} currentPage={currentPage} itemsPerPage={itemsPerPage} height={300}></GraphPrecipitazione>
                  </div>
                  <div className='ms-4'>
                      <div>
                        {/* Appendo i filtri per data e prodotto selezionato*/}
                        <div className='mb-3 d-flex justify-content-between'>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker className='me-2' defaultValue={dayjs(new Date(precipitazioni.length > 0 ? precipitazioni[precipitazioni.length - 1].data : '2000-01-01'))} label="Da data" onChange={(newValue) => setDaDataValue(newValue)} />
                            <DatePicker className='me-2' defaultValue={dayjs(new Date())} label="A data" onChange={(newValue) => setADataValue(newValue)} />
                            <div className="form-floating w-25">
                                <select className="form-select w-100"  id="floatingSelect" aria-label="Scelta Tempo" defaultValue='Tutti' onChange={(e) => setSelectedNome(e.target.value)}>
                                  <option>Tutti</option>
                                  {/* Inserisco nel select un opzone per ogni nome precipitazione precedentemente inserito nell'UseEffect */}
                                  {nomiPrecipitazioni.map((nome, index) => (
                                    <option key={index} value={nome}>{nome}</option>
                                  ))}
                                </select>
                              <label htmlFor="floatingSelect">Filtra per Tempo</label>
                            </div>
                          </LocalizationProvider>
                        </div>
                        {/* Filtro litri a metro quadro */}
                        <div className='d-flex justify-content-between mb-3'>
                          <div className="input-group me-2">
                            <span className="input-group-text" id="inputGroup-sizing-default">Da Lt/m²</span>
                            <input type="number" value={daLtm2Value} onChange={(e) => setDaLtm2Value(e.target.value)} className="form-control" aria-label="Filtro da lt/m²" aria-describedby="inputGroup-sizing-default" />
                          </div>
                          <div className="input-group">
                            <span className="input-group-text" id="inputGroup-sizing-default">A Lt/m²</span>
                            <input type="number" value={aLtm2Value} onChange={(e) => setALtm2Value(e.target.value)} className="form-control" aria-label="Filtro a lt/m²" aria-describedby="inputGroup-sizing-default" />
                          </div>
                          
                        </div>
                      </div>
                      {/* Filtro temperature */}
                      <div className='d-flex justify-content-between mb-3'>
                        <div className="input-group me-2">
                              <span className="input-group-text" id="inputGroup-sizing-default">Da Temperatura</span>
                              <input type="number" value={daTemperaturaValue} onChange={(e) => setDaTemperaturaValue(e.target.value)} className="form-control" aria-label="Filtro da temperatura" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        <div className="input-group">
                              <span className="input-group-text" id="inputGroup-sizing-default">A Temperatura</span>
                              <input type="number" value={aTemperaturaValue} onChange={(e) => setATemperaturaValue(e.target.value)} className="form-control" aria-label="Filtro a temperatura" aria-describedby="inputGroup-sizing-default" />
                        </div>
                      </div>
                       {/* Appendo la paginzione, bottoni avanti ed indietro, i bottoni permettono di scorrere i dati, mantenendo allineati i dati del grafico con quelli della tabella*/}
                      <nav aria-label="Pagination">
                        <ul className="pagination d-flex justify-content-between">
                          <li className="page-item">
                            <button className="page-link" onClick={() => setCurrentPage(prevPage => Math.max(1, prevPage - 1))}>Indietro</button>
                          </li>
                          <li className="page-item">
                            {/* Se siamo all'ultima pagina, disabilito il bottone */}
                            <button disabled={currentPage === maxPages } onClick={() => setCurrentPage(prevPage => prevPage + 1)} className={`page-link ${currentPage === maxPages ? 'disabled' : ''}`}>Avanti</button>
                          </li>
                        </ul>
                      </nav>
                      {/* Mostro a quale pagina siamo */}
                      <div className='d-flex justify-content-end mb-2'>
                          <span>Pagina {currentPage} di {maxPages}</span>
                      </div>
                      {/* Appendo la tabella passando come parametri i dati delle precipitazioni, la pagina corrente ed il numero di oggetti da mostrare per pagina */}
                      <TablePrecipitazione precipitazioneData={precipitazioni} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                  </div>
                </>
                )}
                </div>
            </div>
        </div>
    );
}

export default Precipitazioni;