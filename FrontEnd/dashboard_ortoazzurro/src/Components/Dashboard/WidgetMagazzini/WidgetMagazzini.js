import './WidgetMagazzini.css';
import React from 'react';
import { getData } from '../../../Servizi/apiService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import magazziniImage from '../../../Resources/magazzino.png'; 
import infoImage from '../../../Resources/info.png';

//Componente widget per mostrare un breve riepilogo su i magazzini dell'azienda
const WidgetMagazzini = () =>{
    //Riferimento alla funzione per navigare verso la pagina di dettaglio dei magazzini
    const navigate = useNavigate();
    //Stato per salvare il conteggio dei magazzini
    const [magazziniCount, setMagazziniCount] = useState([]);
    
    //All'avvio del componente viene richiamata la funzione fetchDataMagazzini per ottenere i dati dei magazzini
    useEffect(() => {
        const fetchDataMagazzini = async () => {
          try {
            //Eseguo la chiamata asincrona al API backend
            const resultMagazzini = await getData('/api/data/magazzini');
            //Imposto il conteggio dei magazzini
            setMagazziniCount(resultMagazzini.length);
          } catch (errore) {
            console.error('Errore caricamento dati magazzini:', errore);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataMagazzini();
    }, []);
    
    //Funzione per navigare alla pagina del dettaglio magazzini
    function handleClick() {
        navigate("/magazzini");
    }

    return (
         /* Imposto il contenuto del componente */
        <div className='p-2 clickable' onClick={handleClick}>
            <div className='border border-secondary bg-light'>
                <div className='row g-0'>
                    <div className='border-secondary border-end fit-content' id='image'>
                        <img src={magazziniImage} alt="Magazzini"/>
                    </div>
                    <div className='col-1 g-0'>
                        <div className='d-flex justify-content-start'>
                            <div><img src={infoImage} className='clickable invert' onClick={handleClick} alt='immagine link' width={30} height={30}></img></div>
                        </div>
                    </div>
                    <div className='col g-0' id='content'>
                        <div className='d-inline-flex align-items-center justify-content-center h-100 w-100'>
                            {/* Mostro il conteggio degli utenti */}
                            <span className='fs-4 fw-light'>TOTALE MAGAZZINI {magazziniCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WidgetMagazzini;