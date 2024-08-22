import './Costi.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import TableCosto from './TableCosto/TableCosto';
import IsLoading from '../IsLoading/isLoading';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GraphCosto from './GraphCosto/GraphCosto';

//Componente per la visualizzazione dei costi aziendali
const Costi = () => {
    //Stato per memorizzare i dati dei costi
    const [costi, setCosti] = useState([]);
    //Stato per memorizzare la pagina di tabella corrente
    const [currentPage, setCurrentPage] = useState(1);
    //Definisco quanti elementi mostrare nella tabella
    const itemsPerPage = 20;
    //Calcolo quante sono le pagine totali
    const maxPages = Math.ceil(costi.length / itemsPerPage);
    //Stato per gestire il filtro da costo
    const [aCosto, setACostoValue] = useState('');
    //Stato per gestire il filtro a costo
    const [daCosto, setDaCostoValue] = useState('');
    //Stato per gestire il filtro data di partenza e gli do' un valore di default
    const [daDataValue, setDaDataValue] = useState(dayjs('2000-01-01'));
    //Stato per gestire il filtro data di fine
    const [aDataValue, setADataValue] = useState(dayjs(new Date()));
    //Stato per gestire il caricamento dei dati, permette di attendere in maniera graziosa il caricamento
    const [isLoading, setIsLoading] = useState(true);
    
    //All'avvio del componente viene richiamata la funzione fetchDataCosti per ottenere i dati
    //Viene chiamata anche quando cambiano le variabili daDataValue, aDataValue, aCosto, daCosto per eseguire i filtri
    useEffect(() => {
        const fetchDataCosti = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultCosti = await getData('/api/data/costi');
            //Sorting dei dati dalla data piu' recente alla piu' lontana
            resultCosti.sort((a, b) => new Date(b.data) - new Date(a.data));
           
            //Ricostruisco l'oggetto che verra' renderizzato per accorpare i costi del personale e i costi delle perdite dei prodotti
            //in quanto mostrarli separatamente non e' di molto valore informativo: i costi delle perdite sui prodotti si vedono meglio dal widget in dashboard
            let filteredData = resultCosti.map((costo) =>{
              return {
                id: costo.id,
                data: costo.data,
                costo: (costo.costopersonale + costo.costoperdita)
              }
            });
            //Se ho impostato i filtri da data a data, mostro i dati in quel range di date
            if (daDataValue && aDataValue) { 
              filteredData = filteredData.filter((costo) => 
                new Date(costo.data) >= daDataValue && new Date(costo.data) <= aDataValue
              );
            }
            //Se ho impostato i filtri per il costo, mostro solo i dati compresi in quel range di valori
            if(daCosto || aCosto){
              filteredData = filteredData.filter((costo) =>
                (!daCosto || costo.costo >= daCosto) &&  
                (!aCosto || costo.costo <= aCosto)
              );
            }
            //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
            setCosti(filteredData);
            //Imposto la pagina corrente come la prima altrimenti a causa dei filtri, potremmo ritrovarci in una pagina che non ha dati
            setCurrentPage(1);
          } catch (errore) {
            console.error('Errore caricamento dati costi:', errore);
          }
          finally {
            //Imposto loading a falso, cosi' da mostrare i dati solo quando sono pronti
            setIsLoading(false);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataCosti();
        //L'UseEffect verra' ricalcolato al cambio di queste variabili
      }, [daDataValue, aDataValue, aCosto,daCosto]);

    return(
      <div className="m-4">
          <h3>Costi Aziendali</h3>
          <div className='d-flex justify-content-center'>
            <div className='card px-4 fit-content'>
            {isLoading ?  (
              /* Se stiamo attendendo la fine del carcamento dati, mostro il componente di caricamento */
                <IsLoading/>
              ) : (
                <>
                {/* Il grafico e' in testa alla pagina, a cui assegno i dati di costi, pagina corrente e numero di oggetti da mostrare, cosi' da sincronizzare il tutto con i filtri e la tabella */}
                <GraphCosto costoData={costi} height={300} currentPage={currentPage} itemsPerPage={itemsPerPage}/> 
                {/* Appendo i filtri alla pagina */}
                <div className='mb-2 d-flex justify-content-between'>
                  {/* Creo il datepicker per i filtri sulle date inizializzando anche un valore di default */}
                   <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <DatePicker className='me-2' defaultValue={dayjs(new Date(costi.length > 0 ? costi[costi.length - 1].data : '2000-01-01'))} label="Da data" onChange={(newValue) => setDaDataValue(newValue)} />
                     <DatePicker className='me-2' defaultValue={dayjs(new Date())} label="A data" onChange={(newValue) => setADataValue(newValue)} />
                   </LocalizationProvider>
                 </div>
                 {/* Filtri sui costi Da a */}
                 <div className='d-flex justify-content-between mb-3'>
                   <div className="input-group me-2">
                     <span className="input-group-text" id="inputGroup-sizing-default">Costi da €</span>
                     <input type="number" value={daCosto} onChange={(e) => setDaCostoValue(e.target.value)} className="form-control" aria-label="Filtro da Costo" aria-describedby="inputGroup-sizing-default" />
                   </div>
                   <div className="input-group">
                     <span className="input-group-text" id="inputGroup-sizing-default">Costi a €</span>
                     <input type="number" value={aCosto} onChange={(e) => setACostoValue(e.target.value)} className="form-control" aria-label="Filtro a Costo" aria-describedby="inputGroup-sizing-default" />
                   </div>
                 </div>
                 {/* Componente di paginazione per la tabella ed i dati dei componenti, permette di scorrere avanti o indietro */}
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
               {/* Mostro a quale pagina dei dati siamo */}
               <div className='d-flex justify-content-end mb-2'>
                   <span>Pagina {currentPage} di {maxPages}</span>
               </div>
               {/* Componente tabella dei costi a cui passo i dati dei costi, la pagina corrente ed il numero di oggetti da mostrare, tutto allineato con il grafico */}
               <TableCosto costoData={costi} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                </>
              )}
            </div>
          </div>
      </div>
    );
}

export default Costi;