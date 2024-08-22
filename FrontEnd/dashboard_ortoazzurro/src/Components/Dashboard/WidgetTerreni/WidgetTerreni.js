import './WidgetTerreni.css';
import React from 'react';
import { getData } from '../../../Servizi/apiService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import terreniImage from '../../../Resources/terreno.png'; 
import infoImage from '../../../Resources/info.png';

//Componente widget per mostrare un breve riepilogo su i terreni dell'azienda
const WidgetTerreni = () =>{
    //Riferimento alla funzione per navigare verso la pagina di dettaglio dei terreni
    const navigate = useNavigate();
    //Stato per salvare il conteggio dei terreni
    const [terreniCount, setTerreniCount] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataTerreni per ottenere i dati dei terreni
    useEffect(() => {
        const fetchDataTerreni = async () => {
          try {
            //Eseguo la chiamata asincrona al API backend
            const resultTerreni = await getData('/api/data/terreni');
            //Imposto il conteggio dei terreni
            setTerreniCount(resultTerreni.length);
          } catch (errore) {
            console.error('Errore caricamento dati terreni:', errore);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataTerreni();
    }, []);
    
    //Funzione per navigare alla pagina del dettaglio terreni
    function handleClick() {
        navigate("/terreni");
    }

    return (
        /* Imposto il contenuto del componente */
        <div className='p-2 clickable' onClick={handleClick}>
            <div className='border border-secondary bg-light'>
                <div className='row g-0'>
                    <div className='border-secondary border-end fit-content' id='image'>
                        <img src={terreniImage} alt="Terreni"/>
                    </div>
                    <div className='col-1 g-0'>
                      <div className='d-flex justify-content-start'>
                            <div><img src={infoImage} className='clickable invert' onClick={handleClick} alt='immagine link' width={30} height={30}></img></div>
                        </div>
                    </div>
                    <div className='col g-0' id='content'>
                        <div className='d-inline-flex align-items-center justify-content-center h-100 w-100'>
                            {/* Mostro il conteggio dei terreni */}
                            <span className='fs-4 fw-light'>TOTALE TERRENI {terreniCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WidgetTerreni;