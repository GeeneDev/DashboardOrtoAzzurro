import './WidgetValoreAziendale.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getData } from '../../../Servizi/apiService';
import macchinarioImage from '../../../Resources/macchinario.png'; 
import strumentoImage from '../../../Resources/strumento.png'; 
import prodottoImage from '../../../Resources/prodotto.png'; 
import agrofarmacoImage from '../../../Resources/agrofarmaco.png'; 
import concimeImage from '../../../Resources/concime.png'; 
import fertilizzanteImage from '../../../Resources/fertilizzante.png'; 

//Componente widget per mostrare il valore dei beni aziendali, divisi per tipologia
const WidgetValoreAziendale = () => {
    //Stato per salvare i dati dei magazzini  
    const [magazzini, setMagazzini] = useState([]);
    //Stato per salvare i dati dei macchinari
    const [macchinariData, setMacchinari] = useState([]);
    //Stato per salvare i dati dei concimi
    const [concimiData, setConcimi] = useState([]);
    //Stato per salvare i dati dei fertilizzanti
    const [fertilizzantiData, setFertilizzanti] = useState([]);
    //Stato per salvare i dati degli agrofarmaci
    const [agrofarmaciData, setAgrofarmaci] = useState([]);
    //Stato per salvare i dati degli strumenti
    const [strumentiData, setStrumenti] = useState([]);
    //Stato per salvare i dati dei prodotti
    const [prodottiData, setProdotti] = useState([]);
    //Riferimento alla funzione per navigare verso la pagina di dettaglio delle vendite
    const navigate = useNavigate();

    //All'avvio del componente viene richiamata la funzione fetchAllData per ottenere tutti i dati delle chiamate API attese tutte insieme
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                //Effettuo tutte le chiamate e ne attendo tutte le risposte con await Promise.all
                const [magazzini, macchinariResult, concimiResult, fertilizzantiResult, agrofarmaciResult, strumentiResult, prodottiResult] = await Promise.all([
                  getData('/api/data/magazzini'),
                  getData('/api/data/macchinari'),
                  getData('/api/data/concimi'),
                  getData('/api/data/fertilizzanti'),
                  getData('/api/data/agrofarmaci'),
                  getData('/api/data/strumentazione'),
                  getData('/api/data/prodotti')
                ]);
                //Imposto i dati dei magazzini
                setMagazzini(magazzini);
                //Imposto i dati dei macchinari
                setMacchinari(macchinariResult);
                //Imposto i dati dei concimi
                setConcimi(concimiResult);
                //Imposto i dati dei fertilizzanti
                setFertilizzanti(fertilizzantiResult);
                //Imposto i dati degli agrofarmaci
                setAgrofarmaci(agrofarmaciResult);
                //Imposto i dati degli strumenti
                setStrumenti(strumentiResult);
                //Imposto i dati dei prodotti
                setProdotti(prodottiResult);
            } catch (errore) {
                console.error('Errore caricamento dati:', errore);
            }
        };
        //Eseguo effettivamente le operazioni
        fetchAllData();
    }, []);

  //Funzione per navigare alla pagina del dettaglio dell'oggetto selezionato
  function handleClick(path) {
      navigate(`/${path}`);
  }

    //Variabili per il calcolo del valore per ogni categoria
    let valoreAgrofarmaci = 0;
    let valoreConcimi = 0;
    let valoreFertilizzanti = 0;
    let valoreMacchinari = 0;
    let valoreStrumenti = 0;
    let valoreProdotti = 0;
    //Per ogni magazzino calcolo il valore delle categorie 
    magazzini.forEach(magazzino => {
        //Se quel magazzino ha agrofarmaci, ne calcolo il valore
        if(magazzino.agrofarmaci.length > 0){
            //Ricerco il valore di tutti gli agrofarmaci nel magazzino
            magazzino.agrofarmaci.forEach(element => {
              //Cerco quale agrofarmaco matcha l'id 
              const matchingAgrofarmaci = agrofarmaciData.find(agrofarmaco => agrofarmaco.id === element.id);
              //Se lo trovo, aggiorno il valoreAgrofarmaci con il costo * quantita
              if(matchingAgrofarmaci !== undefined){
                valoreAgrofarmaci += matchingAgrofarmaci.costo * element.quantita;
                //Assegno l'oggetto dell'agrofarmaco trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
                Object.assign(element, matchingAgrofarmaci);
              }
            });
        }
        //Se quel magazzino ha concimi, ne calcolo il valore
        if(magazzino.concimi.length > 0){
          //Ricerco il valore di tutti i concimi nel magazzino
          magazzino.concimi.forEach(element => {
            //Cerco quale concime matcha l'id 
            const matchingConcimi = concimiData.find(concime => concime.id === element.id);
            //Se lo trovo, aggiorno il valoreConcimi con il costo * quantita
            if(matchingConcimi !== undefined){
              valoreConcimi += matchingConcimi.costo * element.quantita;
              //Assegno l'oggetto del concime trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
              Object.assign(element, matchingConcimi);
            }
          });
        }
        //Se quel magazzino ha fertilizzanti, ne calcolo il valore
        if(magazzino.fertilizzanti.length > 0){
          //Ricerco il valore di tutti i fertilizzanti nel magazzino
          magazzino.fertilizzanti.forEach(element => {
            const matchingFertilizzanti = fertilizzantiData.find(fertilizzante => fertilizzante.id === element.id);
            //Se lo trovo, aggiorno il valoreFertilizzanti con il costo * quantita
            if(matchingFertilizzanti !== undefined){
                valoreFertilizzanti += matchingFertilizzanti.costo * element.quantita;
                //Assegno l'oggetto del fertilizzante trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
                Object.assign(element, matchingFertilizzanti);
            }
          });
        }
        //Se quel magazzino ha macchinari, ne calcolo il valore
        if(magazzino.macchinari.length > 0){
          //Ricerco il valore di tutti i macchinari nel magazzino
          magazzino.macchinari.forEach(element => {
            //Cerco quale macchinario matcha l'id 
            const matchingMacchinario = macchinariData.find(macchinario => macchinario.id === element.id);
            //Se lo trovo, aggiorno il valoreMacchinari con il costo * quantita
            if(matchingMacchinario !== undefined){
                valoreMacchinari += matchingMacchinario.costo * element.quantita;
                //Assegno l'oggetto del macchinario trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
                Object.assign(element, matchingMacchinario);
            }
          });
        }
        //Se quel magazzino ha strumenti, ne calcolo il valore
        if(magazzino.strumenti.length > 0){
          //Ricerco il valore di tutti gli strumenti nel magazzino
          magazzino.strumenti.forEach(element => {
            //Cerco quale strumento matcha l'id 
            const matchingStrumenti = strumentiData.find(strumento => strumento.id === element.id);
            //Se lo trovo, aggiorno il valoreStrumenti con il costo * quantita
            if(matchingStrumenti !== undefined){
                valoreStrumenti += matchingStrumenti.costo * element.quantita;
                //Assegno l'oggetto dello strumento trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
                Object.assign(element, matchingStrumenti);
            }
          });
        }
        //Se quel magazzino ha prodotti finiti, ne calcolo il valore
        if(magazzino.prodotti.length > 0){
          //Ricerco il valore di tutti i prodotti finiti nel magazzino
          magazzino.prodotti.forEach(element => {
            //Cerco quale prodotto matcha l'id 
            const matchingProdotti = prodottiData.find(prodotto => prodotto.id === element.id);
            //Se lo trovo, aggiorno il valoreProdotti con il valoreunitario * quantita
            if(matchingProdotti !== undefined){
                valoreProdotti += matchingProdotti.valoreunitario * element.quantita;
                //Assegno l'oggetto del prodotto trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
                Object.assign(element, matchingProdotti);
            }
          });
        }
    });

    //Calcolo il valore totale dei magazzini da mostrare nell'intestazione sommando tutti i valori per categoria
    let valoreTotale = valoreFertilizzanti + valoreMacchinari + valoreStrumenti + valoreProdotti + valoreAgrofarmaci + valoreConcimi;

    return (
      /* Imposto la tabella con il riepilogo del valore dei beni aziendali distribuito nei magazzini */
        <div className='p-2 h-100'>
          {/* Intestazione tabella */}
            <div className='border border-secondary bg-light d-flex flex-column h-100'>
                <div className='row'>
                    <div className='col-8 d-flex justify-content-center'>
                        <span className='fs-4'>Valore Beni Aziendali</span>
                    </div>
                    <div className='col-4 d-flex justify-content-center clickable'>
                        {/* Il valoreTotale viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='fs-4' onClick={() => handleClick('magazzini')}>{(valoreTotale).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>
                <div className='flex-grow-1'>
                  {/* Appendo la tabella */}
                    <table className="m-0 table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center" scope="col">Nome</th>
                                <th className="text-center" scope="col">Valore</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='p-2 clickable' onClick={() => handleClick('macchinari')}><img src={macchinarioImage} className='me-1 invert' alt='Immagine Macchinari' width={20} /><span>Macchinari in dotazione</span></td >
                                {/* Il valoreMacchinari viene trasformato in tipologia monetaria con stile italiano */}
                                <td className='p-2 text-end'>{(valoreMacchinari).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td > 
                            </tr>
                            <tr>
                                <td className='p-2 clickable' onClick={() => handleClick('strumenti')}><img src={strumentoImage} className='me-1 invert' alt='Immagine Strumenti' width={20} /><span>Strumenti in dotazione</span></td >
                                {/* Il valoreStrumenti viene trasformato in tipologia monetaria con stile italiano */}
                                <td className='p-2 text-end'>{(valoreStrumenti).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td > 
                            </tr>
                            <tr>
                                <td className='p-2 clickable' onClick={() => handleClick('concimi')}><img src={concimeImage} className='me-1 invert' alt='Immagine Concimi' width={20} /><span>Concimi in magazzino</span></td >
                                {/* Il valoreConcimi viene trasformato in tipologia monetaria con stile italiano */}
                                <td className='p-2 text-end'>{(valoreConcimi).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td > 
                            </tr>
                            <tr>
                                <td className='p-2 clickable' onClick={() => handleClick('fertilizzanti')}><img src={fertilizzanteImage} className='me-1 invert' alt='Immagine Fertilizzanti' width={20} /><span>Fertilizzanti in magazzino</span></td >
                                {/* Il valoreFertilizzanti viene trasformato in tipologia monetaria con stile italiano */}
                                <td className='p-2 text-end'>{(valoreFertilizzanti).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td > 
                            </tr>
                            <tr>
                                <td className='p-2 clickable' onClick={() => handleClick('agrofarmaci')}><img src={agrofarmacoImage} className='me-1 invert' alt='Immagine Agrofarmaci' width={20} /><span>Agrofarmaci in magazzino</span></td >
                                {/* Il valoreAgrofarmaci viene trasformato in tipologia monetaria con stile italiano */}
                                <td className='p-2 text-end'>{(valoreAgrofarmaci).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td > 
                            </tr>
                            <tr>
                                <td className='p-2 clickable' onClick={() => handleClick('prodotti')}><img src={prodottoImage} className='me-1 invert' alt='Immagine Prodotti' width={20} /><span>Prodotti finiti a Saldo da vendere</span></td >
                                {/* Il valoreProdotti viene trasformato in tipologia monetaria con stile italiano */}
                                <td className='p-2 text-end'>{(valoreProdotti).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td > 
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default WidgetValoreAziendale;