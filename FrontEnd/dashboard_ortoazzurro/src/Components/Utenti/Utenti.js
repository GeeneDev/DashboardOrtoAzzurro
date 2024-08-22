import './Utenti.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardUtente from './CardUtente/CardUtente';

//Componente per la visualizzazione degli utenti
//Diviso in due parti: il componente principale e quello dei singoli utenti definito tramite CardUtente
const Utenti = () => {
  //Stato per memorizzare i dati degli utenti
  const [utenti, setUtenti] = useState([]);
  //Stato per memorizzare i dati delle sedi
  const [sedi, setSedi] = useState([]);
  //All'avvio del componente viene richiamata la funzione fetchDataUtenti per ottenere i dati
  useEffect(() => {
    const fetchDataUtenti = async () => {
      try {
        //Chiamata asincrona verso il backend
        const resultUtenti = await getData('/api/data/utenti');
        //Filtro gli utenti che hanno un contratto scaduto, mostrando solo quelli a tempo indeterminato o con contratto in corso di validita'
        let filteredResult = resultUtenti.filter(utente => {
          if (utente.datainiziocontratto && utente.datafinecontratto) {
            const currentDate = new Date();
            return (currentDate >= new Date(utente.datainiziocontratto) && currentDate <= new Date(utente.datafinecontratto));
          }
          
          return true;
        });
        //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
        setUtenti(filteredResult);
      } catch (errore) {
        console.error('Errore caricamento dati utenti:', errore);
      }
    };
    //Eseguo effettivamente la chiamata
    fetchDataUtenti();
  }, []);

  //All'avvio del componente viene richiamata la funzione fetchDataSedi per ottenere i dati
  useEffect(() => {
    const fetchDataSedi = async () => {
      try {
        //Chiamata asincrona verso il backend
        const resultSedi = await getData('/api/data/sedi');
        //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
        setSedi(resultSedi);
      } catch (errore) {
        console.error('Errore caricamento dati sedi:', errore);
      }
    };
    //Eseguo effettivamente la chiamata
    fetchDataSedi();
  }, []);

  //Rendering del componente
  return (
    <div className='m-4'>
      <h3>Utenti</h3>
      <div className='d-flex flex-wrap justify-content-start'>
        {
          utenti.map(utente => {
              const matchingSede = sedi.find(sede => sede.id === utente.sede);
              return (
                <div key={utente.id}>
                  {/* Mappo i dati degli utenti e genero un componente CardUtente per ogni entry */}
                  <CardUtente key={utente.id+'card'}
                    id = {utente.id}
                    username={utente.username}
                    nome={utente.nome}
                    cognome={utente.cognome}
                    tipocontratto={utente.tipocontratto}
                    datainiziocontratto={utente.datainiziocontratto || undefined}
                    datafinecontratto={utente.datafinecontratto || undefined}
                    costomensile = {utente.costomensile}
                    ruolo={utente.ruolo}
                    sede={matchingSede ? matchingSede.nome : ''}
                  />
                </div>
              );
            }
          )
        }
      </div>
    </div>
  );
};

export default Utenti;