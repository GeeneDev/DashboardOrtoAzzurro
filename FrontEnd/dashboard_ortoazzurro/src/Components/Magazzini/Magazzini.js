import './Magazzini.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardMagazzinoModal from './CardMagazzinoModal/CardMagazzinoModal';

//Componente per la visualizzazione dei magazzini ed il loro contenuto
//Diviso in tre parti: il componente principale, quello dei singoli magazzini definito tramite CardMagazzinoModal e una finestra modale 
//che si apre quando si clicca su una categoria di magazzino
const Magazzini = () => {
    //Stato per memorizzare i dati dei magazzini
    const [magazzini, setMagazzini] = useState([]);
    //Stato per memorizzare i dati dei macchinari
    const [macchinariData, setMacchinari] = useState([]);
    //Stato per memorizzare i dati dei concimi
    const [concimiData, setConcimi] = useState([]);
    //Stato per memorizzare i dati dei fertilizzanti
    const [fertilizzantiData, setFertilizzanti] = useState([]);
    //Stato per memorizzare i dati degli agrofarmaci
    const [agrofarmaciData, setAgrofarmaci] = useState([]);
    //Stato per memorizzare i dati degli strumenti
    const [strumentiData, setStrumenti] = useState([]);
    //Stato per memorizzare i dati dei prodotti finiti
    const [prodottiData, setProdotti] = useState([]);

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
              //Imposto i dati  dei macchinari
              setMacchinari(macchinariResult);
              //Imposto i dati dei concimi
              setConcimi(concimiResult);
              //Imposto i dati dei fertilizzanti
              setFertilizzanti(fertilizzantiResult);
              //Imposto i dati dei agrofarmaci
              setAgrofarmaci(agrofarmaciResult);
              //Imposto i dati degli strumenti
              setStrumenti(strumentiResult);
              //Imposto i dati dei prodotti
              setProdotti(prodottiResult);
          } catch (errore) {
              console.error('Errore caricamento dati:', errore);
          }
      };
      //Eseguo effettivamente l'operazione
      fetchAllData();
  }, []);

  //Per ogni magazzino vado a calcolare il valore totale dei beni nel magazzino
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
          //Assegno l'oggetto del strumento trovato all'array (al momento non utilizzato, ma comodo per future modifiche ed implementazioni)
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
  });

  //Rendering del componnte
    return (
        <div className='m-4'>
            <h3>Magazzini</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
              magazzini.map(magazzino => {
                return (
                  //Mappo i dati dei magazzini e genero un componente CardMagazzinoModal per ogni entry
                  <div key={magazzino.id} className='m-2'>
                    <CardMagazzinoModal key={magazzino.id}  
                      id={magazzino.id}
                      nome={magazzino.nome}
                      macchinari={magazzino.macchinari}
                      concimi={magazzino.concimi}
                      fertilizzanti={magazzino.fertilizzanti}
                      agrofarmaci={magazzino.agrofarmaci}
                      strumenti={magazzino.strumenti}
                      prodotti={magazzino.prodotti}
                      valoreTotale={magazzino.valoreTotale}
                    />
                  </div>
                )
              })
            }
           
            </div>
       </div>
    );
};

export default Magazzini;