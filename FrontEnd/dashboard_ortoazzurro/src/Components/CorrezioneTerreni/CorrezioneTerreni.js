import './CorrezioneTerreni.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import TimelineCorrezioneTerreno from './TimelineCorrezioneTerreno/TimelineCorrezioneTerreno';
import IsLoading from '../IsLoading/isLoading';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//Componente per la visualizzazione della correzione dei valori dei terreni
//Diviso in due parti: il componente principale ed una timeline per mostrare le attivita' di correzione effettuate
const CorrezioneTerreni = () => {
    //Stato per memorizzare i dati delle correzioni effettuate ai terreni
    const [correzioneTerreni, setCorrezioneTerreni] = useState([]);
    //Stato per gestire il caricamento dei dati, permette di attendere in maniera graziosa il caricamento
    const [isLoading, setIsLoading] = useState(true);
    //Stato per gestire la selezione del terreno da visualizzare nella timeline
    const [selectedNome, setSelectedNome] = useState('Tutti'); 
    //Stato per gestire la selezione dell'arricchimento selezionato tramite select
    const [selectedArricchimento, setSelectedArricchimento] = useState('Tutti'); 
    //Stato per memorizzare i nomi dei terreni da mostrare nei bottoni
    const [nomiTerreno, setNomiTerreno] = useState([]); 
    //Stato per memorizzare i nomi degli arricchimenti nella timeline
    const [nomiArricchimento, setNomiArricchimento] = useState([]); 
    //Stato per gestire il filtro per la data di inizio dei dati
    const [daDataValue, setDaDataValue] = useState(dayjs('2000-01-01'));
    //Stato per gestire il filtro per la data di fine dei dati
    const [aDataValue, setADataValue] = useState(dayjs(new Date()));
    //Stato per mostrare il costo totale delle attivita' di arricchimento terreni renderizzate
    const [costoTotale, setCostoTotale] = useState(0);
    //Stato per gestire il filtro per il costo minimo dei dati da mostrare
    const [daCosto, setDaCostoValue] = useState('');
    //Stato per gestire il filtro per il costo massimo dei dati da mostrare
    const [aCosto, setACostoValue] = useState('');

    //All'avvio del componente viene richiamata la funzione fetchDataCorrezioniTerreno per ottenere i dati
    //Viene chiamata anche quando cambiano le variabili selectedNome, daDataValue, aDataValue, selectedArricchimento, aCosto, daCosto per eseguire i filtri
    useEffect(() => {
        const fetchDataCorrezioniTerreno = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultCorrezioniTerreno = await getData('/api/data/correzioni');
            //Sorting dei dati dal piu recente al piu lontano
            resultCorrezioniTerreno.sort((a, b) => new Date(b.data) - new Date(a.data));
            //Rimuovo le entry senza azioni di arricchimento
            const filteredResults = resultCorrezioniTerreno.filter(item => 'arricchimento' in item && Array.isArray(item.arricchimento) && item.arricchimento.length > 0);
            //Creo un dataset con i nomi dei terreni per i quali sono state effettuate azioni di arricchimento
            const nomiTerrenoSet = new Set();
            resultCorrezioniTerreno.forEach((correzioneTerreno) => {
              nomiTerrenoSet.add(correzioneTerreno.nome);
            });
            //Aggiungo il valore fisso Tutti
            nomiTerrenoSet.add('Tutti');
            //Filtro i nomi dei terreni per ordine alfabetico e metto Tutti in testa cosi da farlo apparire come primo elemento
            const nomiTerrenoArray = Array.from(nomiTerrenoSet).sort((a, b) => a === 'Tutti' ? -1 : 1);
            //Imposto i nomi dei terreni
            setNomiTerreno(nomiTerrenoArray);
            
            //Preparo i filtri sui dati
            let filteredData = filteredResults;
            //Se ho selezionato un nome terreno che non sia tutti, filtro i dati per quel nome
            if (selectedNome !== 'Tutti') {
              filteredData = filteredData.filter(item => item.nome === selectedNome);
            }
            //Se il filtro da data a data e' valorizzato, filtro i dati per quel datarange
            if(daDataValue && aDataValue){
              filteredData = filteredData.filter((correzioneTerreno) => 
                new Date(correzioneTerreno.data) >= daDataValue && new Date(correzioneTerreno.data) <= aDataValue
              );
            }
            //Se ho un costo di partenza o un costo di fine, filtro i dati per quel range di costi
            if(daCosto || aCosto){
              filteredData = filteredData.filter((item) => {
                let filtroValido = false;
                //Se ogni entry ha un costo, verifico se si trova nel range indicato
                for (let arricchimento of item.arricchimento) {
                  if ((!daCosto || arricchimento.costo >= daCosto) && (!aCosto || arricchimento.costo <= aCosto)) {
                    filtroValido = true;
                    break;
                  }
                }
                return filtroValido;
                //Applico il filtro aggiornando il filteredData cosi da preservare i dati originali per filtri susseguenti
              }).map((item) => ({
                ...item,
                arricchimento: item.arricchimento.filter((arricchimento) => (!daCosto || arricchimento.costo >= daCosto) && (!aCosto || arricchimento.costo <= aCosto)),
              }));
            }
            //Creo un dataset di nomi di arricchimenti per il filtro
            const nomiArricchimentoSet = new Set();
            filteredData.forEach((correzioneTerreno) => {
              correzioneTerreno.arricchimento.forEach(arricchimento => {
                nomiArricchimentoSet.add(arricchimento.nome);
              });
            });
            //Inserisco Tutti come opzione, servira' per il filtro
            nomiArricchimentoSet.add('Tutti');
            //Sorto in ordine alfabetico e metto Tutti in cima
            const nomiArricchimentoArray = Array.from(nomiArricchimentoSet).sort((a, b) => a.localeCompare(b)).sort((a, b) => a === 'Tutti' ? -1 : 1);
            setNomiArricchimento(nomiArricchimentoArray);

            //Se sto filtrando per un arricchimento, filtro i dati, salvo se e' stato scelto Tutti, in quel caso non filtro
            if(selectedArricchimento !== 'Tutti'){
              filteredData = filteredData.filter(item => {
                //Trovo l'arricchimento con il nome selezionato
                let filteredArricchimento = item.arricchimento.find((arricchimento) => arricchimento.nome === selectedArricchimento);
                return filteredArricchimento !== undefined;
              })
              //Mappo i dati filtrati per rimuovere le entry che non hanno l'arricchimento selezionato
              .map((item) => ({
                ...item,
                arricchimento: item.arricchimento.filter((arricchimento) => arricchimento.nome === selectedArricchimento),
              }));
            }

            //Calcolo il costo totale degli arricchimenti
            let tmpCostoTotale = 0;
            for (let i = 0; i < filteredData.length; i++) {
              for (let j = 0; j < filteredData[i].arricchimento.length; j++) {
                tmpCostoTotale += filteredData[i].arricchimento[j].costo;
              }
            }

            //Setto il costo totale
            setCostoTotale(tmpCostoTotale);
            //Setto i dati filtrati (oppure non filtrati) da renderizzare
            setCorrezioneTerreni(filteredData);
          } catch (errore) {
            console.error('Errore caricamento dati correzioni terreno:', errore);
          }
          finally{
            //Imposto loading a falso, cosi' da mostrare i dati solo quando sono pronti
            setIsLoading(false);
          }
        };
    
        //Eseguo effettivamente le operazioni
        fetchDataCorrezioniTerreno();
        //L'UseEffect verra' ricalcolato al cambio di queste variabili
      }, [selectedNome,daDataValue, aDataValue,selectedArricchimento, aCosto, daCosto]);

    return (
        <div className="m-4">
            <h3>Correzioni Terreno</h3>
            <div className='d-flex justify-content-center'>
                <div className='card fit-content'>
                {isLoading ?  (
                  /* Se stiamo attendendo la fine del carcamento dati, mostro il componente di caricamento */
                    <IsLoading/>
                    ) : (
                      <>
                      {/* In cima alla pagina mostro i filtri */}
                      <div className='card'>
                        <div className='card-header'>
                          <span className='fs-5'>Mostra azioni correttive sui valori dei terreni per</span>
                        </div>
                        <div className='card-text text-center'>
                          {/* Per ogni nome di terreno creo un bottone con funzione associata per gestire il filtro */}
                          {nomiTerreno.map((nomeTerreno, index) => (
                              <button key={index} className='btn btn-primary m-2' onClick={() => {setSelectedNome(nomeTerreno); setSelectedArricchimento('Tutti');}}>{nomeTerreno}</button>
                          ))}
                        </div>
                        <hr className="border-1 border-top border-black" />
                        <div className='mb-3 d-flex justify-content-between'>
                          {/* Creo il datepicker per i filtri sulle date inizializzando anche un valore di default */}
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker className='ms-2' defaultValue={dayjs(new Date(correzioneTerreni.length > 0 ? correzioneTerreni[correzioneTerreni.length - 1].data : '2000-01-01'))} label="Da data" onChange={(newValue) => setDaDataValue(newValue)} />
                            <DatePicker className='me-2' defaultValue={dayjs(new Date())} label="A data" onChange={(newValue) => setADataValue(newValue)} />
                          </LocalizationProvider>
                        </div>
                        <div className='d-flex justify-content-between ms-2 mb-3 me-2'>
                          <div className="form-floating w-100">
                            <select className="form-select" id="floatingSelect" aria-label="Scelta Tempo" onChange={(e) => setSelectedArricchimento(e.target.value)}>
                              {/* Inserisco nelle opzioni del select i possibili arricchimenti per cui filtrare */}
                              {nomiArricchimento.map((nome, index) => (
                                <option key={index} value={nome}>{nome}</option>
                              ))}
                            </select>
                            <label htmlFor="floatingSelect">Filtra per arricchimento</label>
                          </div>
                        </div>
                        {/* Filtri sui costi da a */}
                        <div className='d-flex justify-content-between mb-3'>
                          <div className="input-group me-2 ms-2">
                            <span className="input-group-text" id="inputGroup-sizing-default">Costo da €</span>
                            <input type="number" value={daCosto} onChange={(e) => setDaCostoValue(e.target.value)} className="form-control" aria-label="Filtro da Valore Costo" aria-describedby="inputGroup-sizing-default" />
                          </div>
                          <div className="input-group me-2">
                            <span className="input-group-text" id="inputGroup-sizing-default">Costo a €</span>
                            <input type="number" value={aCosto} onChange={(e) => setACostoValue(e.target.value)} className="form-control" aria-label="Filtro a Valore Costo" aria-describedby="inputGroup-sizing-default" />
                          </div>
                        </div>
                        <div className='d-flex justify-content-center'>
                          {/* Il costo viene trasformato in tipologia monetaria con stile italiano */}
                          <span className='fs-4'>Costo totale arricchimenti {costoTotale.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                        </div>
                      </div>
                      </>
                    )}
                    {/* Sotto il menu filtri mostro la timeline */}
                    <TimelineCorrezioneTerreno correzioneTerrenoData={correzioneTerreni}/>
                </div>
            </div>
        </div>
    );
}

export default CorrezioneTerreni;