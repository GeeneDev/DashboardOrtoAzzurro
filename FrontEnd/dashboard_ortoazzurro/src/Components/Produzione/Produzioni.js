import './Produzioni.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from 'react';
import TableProduzione from './TableProduzione/TableProduzione';
import GraphProduzione from './GraphProduzione/GraphProduzione';
import IsLoading from '../IsLoading/isLoading';

//Componente per la visualizzazione delle perdite incorse dall'azienda
//Diviso in tre parti: il componente principale, un grafico e una tabella che mostrano i dati della produzione
const Produzioni = () => {
    //Stato per memorizzare i dati della produzione
    const [produzioneData, setProduzione] = useState([]);
    //Stato per memorizzare la pagina corrente, impostata a default a 1
    const [currentPage, setCurrentPage] = useState(1);
    //Stato per memorizzare i nomi dei prodotti, usato dal select del filtro per prodotto
    const [nomiProdotto, setNomiProdotto] = useState([]); 
    //Variabile per indicare quanti oggetti mostrare per pagina e grafico
    const itemsPerPage = 20;
    //Variabile per indicare quante sono le pagine massime (numero dei dati nelle produzione / quanti oggetti da mostrare per pagina)
    const maxPages = Math.ceil(produzioneData.length / itemsPerPage);
    //Stato per gestire il filtro per la data di inizio dei dati
    const [daDataValue, setDaDataValue] = useState(dayjs('2000-01-01'));
    //Stato per gestire il filtro per la data di fine dei dati
    const [aDataValue, setADataValue] = useState(dayjs(new Date()));
    //Stato per memorizzare il nome del prodotto selezionato, usato dal filtro per prodotto, inizializzato a Tutti
    const [selectedNome, setSelectedNome] = useState('Tutti'); 
    //Stato per gestire il caricamento dei dati, permette di attendere in maniera graziosa il caricamento
    const [isLoading, setIsLoading] = useState(true);

    //All'avvio del componente viene richiamata la funzione fetchDataProduzioni per ottenere i dati
    //Viene chiamata anche quando cambiano le variabili selectedNome,daDataValue, aDataValue
    useEffect(() => {
        const fetchDataProduzioni = async () => {
          try {
            //Effettuo tutte le chiamate e ne attendo tutte le risposte con await Promise.all
            const [resultProduzioni, resultProdotti] = await Promise.all([
              getData('/api/data/produzione'),
              getData('/api/data/prodotti')
            ]);
            //Sorting dei dati in base alla data piu recente a quella meno recente
            resultProduzioni.sort((a, b) => {
              return new Date(b.data).getTime() - new Date(a.data).getTime();
            });
            //Creo un array di oggetti che contiene tutte le produzioni con i nomi dei prodotti e unita di misura 
            let resultProduzioniWithNomi = resultProduzioni.map((item) => ({
              ...item,
              produzione: item.produzione.map((prod) => {
                const matchedProdotto = resultProdotti.find(p => p.id === prod.id);
                return { ...prod, nome: matchedProdotto.nome, unitamisura: matchedProdotto.unitamisura };
              })
            }));
            //Creo un dataset di nomi prodotto unici per applicarli al filtro select per prodotto
            const nomiProdottoSet = new Set();
            resultProduzioniWithNomi.forEach((item) => {
              item.produzione.forEach((prod) => {
                const matchedProdotto = resultProdotti.find(p => p.id === prod.id);
                //Se trovo il prodotto tramite l'id, includo il nome nel dataset
                if (matchedProdotto) {
                  nomiProdottoSet.add(matchedProdotto.nome);
                }
              });
            });
            //Ricostruisco un array dal dataset
            const nomiProdottoArray = Array.from(nomiProdottoSet);
            //Sorting in ordine alfabetico dell'array di nomi
            nomiProdottoArray.sort((a, b) => a.localeCompare(b));
            //Imposto i nomi prodotto per fornirli al select filter
            setNomiProdotto(nomiProdottoArray);

            //Preparo i filtri sui dati
            let filteredData = resultProduzioniWithNomi;
            //Se il filtro da data a data e' valorizzato, filtro i dati per quel datarange
            if(daDataValue && aDataValue){
              filteredData = filteredData.filter((produzione) => 
                new Date(produzione.data) >= daDataValue && new Date(produzione.data) <= aDataValue
              );
            }

            //Se ho selezionato un nome prodotto che non sia tutti, filtro i dati per quel nome
            if(selectedNome !== 'Tutti'){
              filteredData = filteredData.filter((item) =>{
                let filteredProduzione = item.produzione.find((prodotto) => prodotto.nome === selectedNome);
                return filteredProduzione !== undefined;
                //Devo anche rimappare l'oggetto per rimuovere i prodotti non selezionati
              }).map((item) => ({
                ...item,
                produzione: item.produzione.filter((prodotto) => prodotto.nome === selectedNome),
              }));
            }
            //Setto i dati filtrati (oppure non filtrati) da renderizzare
            setProduzione(filteredData);
            //Imposto la prima pagina come pagina da visualizzare
            setCurrentPage(1);
          } 
          catch (errore) {
            console.error('Errore caricamento dati produzione:', errore);
          }
          finally {
            //Imposto loading a falso, cosi' da mostrare i dati solo quando sono pronti
            setIsLoading(false);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataProduzioni();
        //L'UseEffect verra' ricalcolato al cambio di queste variabili
      }, [selectedNome,daDataValue, aDataValue]);

    //Rendering del componente
    return(
      <div className="m-4">
          <h3>Produzione</h3>
          <div className='d-flex justify-content-center'>
            <div className='card px-4 fit-content'>  
            {isLoading ?  (
              /* Se stiamo attendendo la fine del carcamento dati, mostro il componente di caricamento */
                <IsLoading/>
              ) : (
                <>     
                 {/* In cima alla pagina mostro il grafico della produzione passando come parametri i dati della produzione, la pagina corrente, il numero di oggetti da motrare per pagina e l'altezza*/}
               <GraphProduzione produzioneData={produzioneData} height={300} currentPage={currentPage} itemsPerPage={itemsPerPage}/> 
               <div>
                 {/* Appendo i filtri per data e prodotto selezionato*/}
                  <div className='mb-2 d-flex justify-content-between'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker className='me-2' defaultValue={dayjs(new Date(produzioneData.length > 0 ? produzioneData[produzioneData.length - 1].data : '2000-01-01'))} label="Da data" onChange={(newValue) => { setDaDataValue(newValue); }} />
                      <DatePicker defaultValue={dayjs(new Date())} label="A data" onChange={(newValue) => { setADataValue(newValue);  }} />
                      <div className="form-floating">
                        <select className="form-select me-2" aria-label="Scelta Prodotto" defaultValue='Tutti' onChange={(e) => setSelectedNome(e.target.value)}>
                          <option >Tutti</option>
                          {/* Inserisco nel select un opzone per ogni nome prodotto precedentemente inserito nell'UseEffect */}
                          {nomiProdotto.map((nome, index) => (
                            <option key={index} value={nome}>{nome}</option>
                          ))}
                        </select>
                        <label htmlFor="floatingSelect">Filtra per Prodotto Finito</label>
                      </div>
                    </LocalizationProvider>
                  </div>
               </div>
               {/* Appendo la paginzione, bottoni avanti ed indietro, i bottoni permettono di scorrere i dati, mantenendo allineati i dati del grafico con quelli della tabella*/}
               <nav aria-label="Pagination">
                   <ul className="pagination d-flex justify-content-between">
                      <li className="page-item" >
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
               {/* Appendo la tabella passando come parametri i dati della produzione, la pagina corrente ed il numero di oggetti da mostrare per pagina */}
               <TableProduzione produzioneData={produzioneData} currentPage={currentPage} itemsPerPage={itemsPerPage} />
               </>
            )}
              </div>
          </div>
      </div>
    );
}

export default Produzioni;