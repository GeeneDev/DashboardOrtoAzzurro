import './Vendite.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import TableVendita from './TableVendita/TableVendita';
import IsLoading from '../IsLoading/isLoading';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GraphVendita from './GraphVendita/GraphVendita';

//Componente per la visualizzazione delle vendite dall'azienda
//Diviso in tre parti: il componente principale, un grafico e una tabella che mostrano i dati della produzione
const Vendite = () => {
    //Stato per memorizzare i dati delle vendite
    const [vendite, setVendite] = useState([]);
    //Stato per memorizzare la pagina corrente, impostata a default a 1
    const [currentPage, setCurrentPage] = useState(1);
    //Variabile per indicare quanti oggetti mostrare per pagina e grafico
    const itemsPerPage = 20;
    //Variabile per indicare quante sono le pagine massime (numero dei dati nelle vendite / quanti oggetti da mostrare per pagina)
    const maxPages = Math.ceil(vendite.length / itemsPerPage);
    //Stato per memorizzare i nomi dei prodotti, usato dal select del filtro per prodotto
    const [nomiProdotto, setNomiProdotto] = useState([]); 
    //Stato per memorizzare il nome del prodotto selezionato, usato dal filtro per prodotto, inizializzato a Tutti
    const [selectedNome, setSelectedNome] = useState('Tutti'); 
    //Stato per memorizzare il valore minimo di pezzi da considerare nel filtro per PZ
    const [aPZ, setAPZValue] = useState('');
    //Stato per memorizzare il valore massimo di pezzi da considerare nel filtro per PZ
    const [daPz, setDaPzValue] = useState('');
    //Stato per memorizzare il valore minimo di vendita da considerare nel filtro per vendita
    const [aVendita, setAVenditaValue] = useState('');
    //Stato per memorizzare il valore massimo di vendita da considerare nel filtro per vendita
    const [daVendita, setDaVenditaValue] = useState('');
    //Stato per gestire il filtro per la data di inizio dei dati
    const [daDataValue, setDaDataValue] = useState(dayjs('2000-01-01'));
    //Stato per gestire il filtro per la data di fine dei dati
    const [aDataValue, setADataValue] = useState(dayjs(new Date()));
    //Stato per gestire il caricamento dei dati, permette di attendere in maniera graziosa il caricamento
    const [isLoading, setIsLoading] = useState(true);

    //All'avvio del componente viene richiamata la funzione fetchDataVendite per ottenere i dati
    //Viene chiamata anche quando cambiano le variabili daDataValue, aDataValue, selectedNome, aVendita, daVendita, daPz, aPZ
    useEffect(() => {
        const fetchDataVendite = async () => {
          try {
            //Eseguo la chiamata asincrona al API backend
            const resultVendite = await getData('/api/data/vendite');
            //Sorting dei dati in base alla data piu recente a quella meno recente
            resultVendite.sort((a, b) => new Date(b.data) - new Date(a.data));
             //Creo un dataset di nomi prodotto unici per applicarli al filtro select per prodotto
            const nomiProdottoSet = new Set();
            resultVendite.forEach((item) => {
              nomiProdottoSet.add(item.prodotto.nome);
            });
            //Ricostruisco un array dal dataset per i nomi prodotto
            const nomiProdottoArray = Array.from(nomiProdottoSet);
            //Sorting dei nomi prodotto in ordine alfabetico
            nomiProdottoArray.sort((a, b) => a.localeCompare(b));
            //Imposto i nomi prodotto per fornirli al select filter
            setNomiProdotto(nomiProdottoArray);
            //Preparo i filtri sui dati
            let filteredData = resultVendite;
            //Se il filtro da data a data e' valorizzato, filtro i dati per quel datarange
            if (daDataValue && aDataValue) { 
              filteredData = filteredData.filter((vendita) => 
                new Date(vendita.data) >= daDataValue && new Date(vendita.data) <= aDataValue
              );
            }
            //Se il valore daPz o aPz e' valorizzato, filtro i dati per quel range di quantita' vendute
            if (daPz || aPZ) {
              filteredData = filteredData.filter((vendita) =>
                (!daPz || vendita.quantita >= daPz) && 
                (!aPZ || vendita.quantita <= aPZ) 
              );
            }
            //Se il valore daVendita o aVendita e' valorizzato, filtro i dati per quel range di valore venduto
            if(daVendita || aVendita){
              filteredData = filteredData.filter((vendita) =>
                (!daVendita || vendita.valoreVendita >= daVendita) &&  
                (!aVendita || vendita.valoreVendita <= aVendita)
              );
            }
            //Se ho selezionato un nome prodotto che non sia tutti, filtro i dati per quel nome
            if(selectedNome !== 'Tutti'){
              filteredData = filteredData.filter((vendita) => vendita.prodotto.nome === selectedNome);
            }
            //Setto i dati filtrati (oppure non filtrati) da renderizzare
            setVendite(filteredData);
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
        //Imposto loading a falso, cosi' da mostrare i dati solo quando sono pronti
        fetchDataVendite();
        //L'UseEffect verra' ricalcolato al cambio di queste variabili
      }, [daDataValue, aDataValue,selectedNome, aVendita,daVendita,daPz,aPZ]);

    //Rendering del componente
    return(
      <div className="m-4">
          <h3>Vendita Prodotti Finiti</h3>
          <div className='d-flex justify-content-center'>
            <div className='card px-4 fit-content'>
            {isLoading ?  (
              /* Se stiamo attendendo la fine del carcamento dati, mostro il componente di caricamento */
                <IsLoading/>
              ) : (
                <>
                {/* In cima alla pagina mostro il grafico delle vendite passando come parametri i dati delle vendite, la pagina corrente, il numero di oggetti da motrare per pagina e l'altezza*/}
                <GraphVendita venditaData={vendite} height={300} currentPage={currentPage} itemsPerPage={itemsPerPage}/> 
                <div className='mb-2 d-flex justify-content-between'>
                   {/* Appendo i filtri per data e prodotto selezionato*/}
                   <LocalizationProvider dateAdapter={AdapterDayjs}>
                     <DatePicker className='me-2' defaultValue={dayjs(new Date(vendite.length > 0 ? vendite[vendite.length - 1].data : '2000-01-01'))} label="Da data" onChange={(newValue) => setDaDataValue(newValue)} />
                     <DatePicker className='me-2' defaultValue={dayjs(new Date())} label="A data" onChange={(newValue) => setADataValue(newValue)} />
                     <div className="form-floating">
                        <select className="form-select" id="floatingSelect" aria-label="Scelta Prodotti" defaultValue='Tutti' onChange={(e) => setSelectedNome(e.target.value)}>
                          <option>Tutti</option>
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
                 {/* Filtro da valore vendita a valore vendita  */}
                 <div className='d-flex justify-content-between mb-3'>
                   <div className="input-group me-2">
                     <span className="input-group-text" id="inputGroup-sizing-default">Vendita da €</span>
                     <input type="number" value={daVendita} onChange={(e) => setDaVenditaValue(e.target.value)} className="form-control" aria-label="Filtro da Valore Vendita" aria-describedby="inputGroup-sizing-default" />
                   </div>
                   <div className="input-group">
                     <span className="input-group-text" id="inputGroup-sizing-default">Vendita a €</span>
                     <input type="number" value={aVendita} onChange={(e) => setAVenditaValue(e.target.value)} className="form-control" aria-label="Filtro a Valore Vendita" aria-describedby="inputGroup-sizing-default" />
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
               {/* Appendo la tabella passando come parametri i dati delle vendite, la pagina corrente ed il numero di oggetti da mostrare per pagina */}
               <TableVendita venditaData={vendite} currentPage={currentPage} itemsPerPage={itemsPerPage} />
                </>
              )}
            </div>
          </div>
      </div>
    );
}

export default Vendite;