import './WidgetValoreMagazzini.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getData } from '../../../Servizi/apiService';
import magazzinoImage from '../../../Resources/magazzino.png'; 

//Componente widget per mostrare il valore dei beni aziendali distribuiti per magazzino
const WidgetValoreMagazzini = () => {
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

    //Variabile per calcolare il valore totale dei magazzini
    let valoreTotaleMagazzini = 0;

    //Per ogni magazzino sommo il valore di agrofarmaci, concimi, fertilizzanti, strumenti, macchinari e prodotti, salvo anche il valoreTotale
    magazzini.forEach(magazzino => {
        //Variabile per calcolare il valore del singolo magazzino
        let valoreTotale = 0;
        //Se quel magazzino ha agrofarmaci, ne calcolo il valore
        if(magazzino.agrofarmaci.length > 0){
            //Ricerco il valore di tutti gli agrofarmaci nel magazzino
            magazzino.agrofarmaci.forEach(element => {
              //Cerco quale agrofarmaco matcha l'id 
              const matchingAgrofarmaci = agrofarmaciData.find(agrofarmaco => agrofarmaco.id === element.id);
              //Se lo trovo, aggiorno il valoreTotale con il costo * quantita
              if(matchingAgrofarmaci !== undefined){
                valoreTotale += matchingAgrofarmaci.costo * element.quantita;
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
            //Se lo trovo, aggiorno il valoreTotale con il costo * quantita
            if(matchingConcimi !== undefined){
              valoreTotale += matchingConcimi.costo * element.quantita;
              //Assegno l'oggetto del concime trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
              Object.assign(element, matchingConcimi);
            }
          });
        }
        //Se quel magazzino ha fertilizzanti, ne calcolo il valore
        if(magazzino.fertilizzanti.length > 0){
          //Ricerco il valore di tutti i fertilizzanti nel magazzino
          magazzino.fertilizzanti.forEach(element => {
            //Cerco quale fertilizzante matcha l'id 
            const matchingFertilizzanti = fertilizzantiData.find(fertilizzante => fertilizzante.id === element.id);
            //Se lo trovo, aggiorno il valoreTotale con il costo * quantita
            if(matchingFertilizzanti !== undefined){
                valoreTotale += matchingFertilizzanti.costo * element.quantita;
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
            //Se lo trovo, aggiorno il valoreTotale con il costo * quantita
            if(matchingMacchinario !== undefined){
                valoreTotale += matchingMacchinario.costo * element.quantita;
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
            //Se lo trovo, aggiorno il valoreTotale con il costo * quantita
            if(matchingStrumenti !== undefined){
                valoreTotale += matchingStrumenti.costo * element.quantita;
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
            //Se lo trovo, aggiorno il valoreTotale con il valoreunitario * quantita
            if(matchingProdotti !== undefined){
                valoreTotale += matchingProdotti.valoreunitario * element.quantita;
                //Assegno l'oggetto del prodotto trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
                Object.assign(element, matchingProdotti);
            }
          });
        }
        //Assegno a quel magazzino il valore totale
        magazzino.valoreTotale = valoreTotale;
        //Aggiorno la variabile di valore globale dei magazzini
        valoreTotaleMagazzini += valoreTotale;
    });

    
    return (
      /* Imposto la tabella di riepilogo valore per magazzino */
        <div className='p-2 h-100'>
          {/* Intestazione tabella */}
            <div className='border border-secondary bg-light d-flex flex-column h-100'>
                <div className='row'>
                    <div className='col d-flex justify-content-center'>
                        <span className='fs-4'>Valore per Magazzino</span>
                    </div>
                    <div className='col-4 d-flex justify-content-center'>
                        {/* Il valoreTotaleMagazzini viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='fs-4 clickable' onClick={() => handleClick('magazzini')}>{(valoreTotaleMagazzini).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
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
                          {/* Per ogni magazzino aggiungo una riga con il nome del magazzino ed il suo valore */}
                          {magazzini.map(magazzino => (
                                <tr key={magazzino.id}>
                                  <td className='p-2 clickable' onClick={() => handleClick('magazzini')}><img src={magazzinoImage} className='me-1 invert' alt='Immagine Magazzini' width={20} /><span>{magazzino.nome}</span></td>
                                  {/* Il valoreTotale del magazzino viene trasformato in tipologia monetaria con stile italiano */}
                                  <td className='p-2 text-end'>{magazzino.valoreTotale.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td>
                                </tr>
                               )
                          )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default WidgetValoreMagazzini;