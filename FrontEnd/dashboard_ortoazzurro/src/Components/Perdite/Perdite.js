import './Perdite.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import TablePerdita from './TablePerdita/TablePerdita';
import IsLoading from '../IsLoading/isLoading';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GraphPerdita from './GraphPerdita/GraphPerdita';

//Componente per la visualizzazione delle perdite incorse dall'azienda
//Diviso in tre parti: il componente principale, un grafico e una tabella che mostrano i dati delle perdite
const Perdite = () => {
    //Stato per memorizzare i dati delle perdite
    const [perdite, setPerdite] = useState([]);
    //Stato per memorizzare la pagina corrente, impostata a default a 1
    const [currentPage, setCurrentPage] = useState(1);
    //Variabile per indicare quanti oggetti mostrare per pagina e grafico
    const itemsPerPage = 20;
    //Variabile per indicare quante sono le pagine massime (numero dei dati nelle perdite / quanti oggetti da mostrare per pagina)
    const maxPages = Math.ceil(perdite.length / itemsPerPage);
    //Stato per memorizzare i nomi dei prodotti, usato dal select del filtro per prodotto
    const [nomiProdotto, setNomiProdotto] = useState([]); 
    //Stato per memorizzare il nome del prodotto selezionato, usato dal filtro per prodotto, inizializzato a Tutti
    const [selectedNome, setSelectedNome] = useState('Tutti'); 
    //Stato per memorizzare da quanti PZ si parte nel filtro per quantità
    const [aPZ, setAPZValue] = useState('');
    //Stato per memorizzare a quanti PZ vuole filtrare nel filtro per quantità
    const [daPz, setDaPzValue] = useState('');
    //Stato per memorizzare il valore minimo della perdita nel filtro per perdita
    const [aPerdita, setAPerditaValue] = useState('');
    //Stato per memorizzare il valore massimo della perdita nel filtro per perdita
    const [daPerdita, setDaPerditaValue] = useState('');
    //Stato per gestire il filtro per la data di inizio dei dati
    const [daDataValue, setDaDataValue] = useState(dayjs('2000-01-01'));
    //Stato per gestire il filtro per la data di fine dei dati
    const [aDataValue, setADataValue] = useState(dayjs(new Date()));
    //Stato per gestire il caricamento dei dati, permette di attendere in maniera graziosa il caricamento
    const [isLoading, setIsLoading] = useState(true);

    //All'avvio del componente viene richiamata la funzione fetchDataPerdite per ottenere i dati
    //Viene chiamata anche quando cambiano le variabili daDataValue, aDataValue, selectedNome, aPerdita, daPerdita, daPz, aPZ per eseguire i filtri
    useEffect(() => {
        const fetchDataPerdite = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultPerdite = await getData('/api/data/perdite');
            //Sorting dei dati dal piu recente al piu lontano
            resultPerdite.sort((a, b) => new Date(b.data) - new Date(a.data));
            //Creo un dataset con i nomi dei prodotti che si vogliono poter filtrare
            const nomiProdottoSet = new Set();
            resultPerdite.forEach((item) => {
              nomiProdottoSet.add(item.prodotto.nome);
            });
            const nomiProdottoArray = Array.from(nomiProdottoSet);
            //Sorting dei nomi dei prodotti in ordine alfabetico
            nomiProdottoArray.sort((a, b) => a.localeCompare(b));
            //Imposto in nomi dei prodotti
            setNomiProdotto(nomiProdottoArray);
            //Preparo i filtri sui dati
            let filteredData = resultPerdite;
            //Se il filtro da data a data e' valorizzato, filtro i dati per quel datarange
            if (daDataValue && aDataValue) { 
              filteredData = filteredData.filter((vendita) => 
                new Date(vendita.data) >= daDataValue && new Date(vendita.data) <= aDataValue
              );
            }
            //Se ho un numero di PZ di partenza o un numero di PZ di fine, filtro i dati per quel range di PZ
            if (daPz || aPZ) {
              filteredData = filteredData.filter((vendita) =>
                (!daPz || vendita.quantita >= daPz) && 
                (!aPZ || vendita.quantita <= aPZ) 
              );
            }
            //Se ho una perdita di partenza o una perdita di fine, filtro i dati per quel range di perdite
            if(daPerdita || aPerdita){
              filteredData = filteredData.filter((vendita) =>
                (!daPerdita || vendita.valorePerdita >= daPerdita) &&  
                (!aPerdita || vendita.valorePerdita <= aPerdita)
              );
            }
            //Se ho selezionato un nome prodotto che non sia tutti, filtro i dati per quel nome
            if(selectedNome !== 'Tutti'){
              filteredData = filteredData.filter((vendita) => vendita.prodotto.nome === selectedNome);
            }
            //Setto i dati filtrati (oppure non filtrati) da renderizzare
            setPerdite(filteredData);
            //Imposto la prima pagina come pagina da visualizzare
            setCurrentPage(1);
          } catch (errore) {
            console.error('Errore caricamento dati vendite:', errore);
          }
          finally {
            //Imposto loading a falso, cosi' da mostrare i dati solo quando sono pronti
            setIsLoading(false);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataPerdite();
        //L'UseEffect verra' ricalcolato al cambio di queste variabili
      }, [daDataValue, aDataValue,selectedNome, aPerdita,daPerdita,daPz,aPZ]);
    
    //Rendering del componente
    return(
      <div className="m-4">
          <h3>Perdita Prodotti Finiti</h3>
          <div className='d-flex justify-content-center'>
            <div className='card px-4 fit-content'>
            {isLoading ?  (
              /* Se stiamo attendendo la fine del carcamento dati, mostro il componente di caricamento */
                <IsLoading/>
              ) : (
                <>
                {/* In cima alla pagina mostro il grafico delle perdite passando come parametri i dati delle perdite, la pagina corrente, il numero di oggetti da motrare per pagina e l'altezza*/}
                <GraphPerdita perditaData={perdite} height={300} currentPage={currentPage} itemsPerPage={itemsPerPage}/> 
                {/* Appendo i filtri per data e prodotto selezionato*/}
                <div className='mb-2 d-flex justify-content-between'>
                   <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <DatePicker className='me-2' defaultValue={dayjs(new Date(perdite.length > 0 ? perdite[perdite.length - 1].data : '2000-01-01'))} label="Da data" onChange={(newValue) => setDaDataValue(newValue)} />
                     <DatePicker className='me-2' defaultValue={dayjs(new Date())} label="A data" onChange={(newValue) => setADataValue(newValue)} />
                     <div className="form-floating">
                        <select className="form-select" id="floatingSelect" aria-label="Scelta Prodotti" defaultValue='Tutti' onChange={(e) => setSelectedNome(e.target.value)}>
                          <option>Tutti</option>
                          {/* Inserisco nel select un opzone per ogni nome prodotto precedentemente inserito nell'UseEffect */}
                          {nomiProdotto.map((nome, index) => (
                            <option key={index} value={nome}>{nome}</option>
                          ))}
                        </select>
                        <label htmlFor="floatingSelect">Filtra per Prodotto Finito</label>
                     </div>
                   </LocalizationProvider>
                 </div>
                 {/* Filtro da PZ a PZ */}
                 <div className='d-flex justify-content-between mb-3'>
                   <div className="input-group me-2">
                     <span className="input-group-text" id="inputGroup-sizing-default">Da PZ</span>
                     <input type="number" value={daPz} onChange={(e) => setDaPzValue(e.target.value)} className="form-control" aria-label="Filtro da PZ" aria-describedby="inputGroup-sizing-default" />
                   </div>
                   <div className="input-group">
                     <span className="input-group-text" id="inputGroup-sizing-default">A PZ</span>
                     <input type="number" value={aPZ} onChange={(e) => setAPZValue(e.target.value)} className="form-control" aria-label="Filtro a PZ" aria-describedby="inputGroup-sizing-default" />
                   </div>
                 </div>
                 {/* Filtro perdita da a */}
                 <div className='d-flex justify-content-between mb-3'>
                   <div className="input-group me-2">
                     <span className="input-group-text" id="inputGroup-sizing-default">Perdita da €</span>
                     <input type="number" value={daPerdita} onChange={(e) => setDaPerditaValue(e.target.value)} className="form-control" aria-label="Filtro da Valore Vendita" aria-describedby="inputGroup-sizing-default" />
                   </div>
                   <div className="input-group">
                     <span className="input-group-text" id="inputGroup-sizing-default">Perdita a €</span>
                     <input type="number" value={aPerdita} onChange={(e) => setAPerditaValue(e.target.value)} className="form-control" aria-label="Filtro a Valore Vendita" aria-describedby="inputGroup-sizing-default" />
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
               {/* Appendo la tabella passando come parametri i dati delle perdite, la pagina corrente ed il numero di oggetti da mostrare per pagina */}
               <TablePerdita perditaData={perdite} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                </>
              )}
            </div>
          </div>
      </div>
    );
}

export default Perdite;