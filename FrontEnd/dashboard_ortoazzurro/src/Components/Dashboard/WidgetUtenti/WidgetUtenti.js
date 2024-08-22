import './WidgetUtenti.css';
import React from 'react';
import { getData } from '../../../Servizi/apiService';
import userImage from '../../../Resources/user.png'; 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import infoImage from '../../../Resources/info.png';

//Componente widget per mostrare un breve riepilogo su gli utenti attivi nel sistema
const WidgetUtenti = () =>{
    //Riferimento alla funzione per navigare verso la pagina di dettaglio degli utenti
    const navigate = useNavigate();
    //Stato per salvare il conteggio degli utenti
    const [utentiCount, setUtentiCount] = useState([]);

    //All'avvio del componente viene richiamata la funzione fetchDataUtenti per ottenere i dati degli utenti
    useEffect(() => {
        const fetchDataUtenti = async () => {
          try {
            //Eseguo la chiamata asincrona al API backend
            const resultUtenti = await getData('/api/data/utenti');
            //Filtro i dati degli utenti per ottenere solo quelli attivi con data di contratto valido, cioe' con data attuale compresa fra inizio e fine contratto
            let filteredResult = resultUtenti.filter(utente => {
              if (utente.datainiziocontratto && utente.datafinecontratto) {
                const currentDate = new Date();
                return (currentDate >= new Date(utente.datainiziocontratto) && currentDate <= new Date(utente.datafinecontratto));
              }
              //Se un utente non ha datainiziocontratto e datafinecontratt, cioe' e' contratto indeterminato, viene considerato comunque attivo
              return true;
            });
            //Imposto il conteggio degli utenti attivi
            setUtentiCount(filteredResult.length);
          } catch (errore) {
            console.error('Errore caricamento dati utenti:', errore);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataUtenti();
    }, []);

    //Funzione per navigare alla pagina del dettaglio utenti
    function handleClick() {
        navigate("/utenti");
    }

    return (
      /* Imposto il contenuto del componente */
        <div className='p-2 clickable' onClick={handleClick}>
            <div className='border border-secondary bg-light'>
                <div className='row g-0'>
                    <div className='border-secondary border-end fit-content' id='image'>
                        <img src={userImage} alt="User"/>
                    </div>
                    <div className='col-1 g-0'>
                      <div className='d-flex justify-content-start'>
                            <div><img src={infoImage} className='clickable invert' onClick={handleClick} alt='immagine link' width={30} height={30}></img></div>
                        </div>
                    </div>
                    <div className='col g-0' id='content'>
                        <div className='d-inline-flex align-items-center justify-content-center h-100 w-100'>
                            {/* Mostro il conteggio degli utenti */}
                            <span className='fs-4 fw-light'>TOTALE UTENTI {utentiCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default WidgetUtenti;