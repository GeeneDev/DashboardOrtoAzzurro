import './WidgetSedi.css';
import React from 'react';
import { getData } from '../../../Servizi/apiService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sediImage from '../../../Resources/sede.png'; 
import infoImage from '../../../Resources/info.png';

//Componente widget per mostrare un breve riepilogo sulle sedi dell'azienda
const WidgetSedi = () =>{
    //Riferimento alla funzione per navigare verso la pagina di dettaglio delle sedi
    const navigate = useNavigate();
    //Stato per salvare il conteggio delle sedi
    const [sediCount, setSediCount] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataSedi per ottenere i dati delle sedi
    useEffect(() => {
        const fetchDataSedi = async () => {
          try {
            //Eseguo la chiamata asincrona al API backend
            const resultSedi = await getData('/api/data/sedi');
            //Imposto il conteggio delle sedi
            setSediCount(resultSedi.length);
          } catch (errore) {
            console.error('Errore caricamento dati sedi:', errore);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataSedi();
    }, []);
    
    //Funzione per navigare alla pagina del dettaglio sedi
    function handleClick() {
        navigate("/sedi");
    }

    return (
        /* Imposto il contenuto del componente */
        <div className='p-2 clickable' onClick={handleClick}>
            <div className='border border-secondary bg-light'>
                <div className='row g-0'>
                    <div className='border-secondary border-end fit-content' id='image'>
                        <img src={sediImage} alt="Sedi"/>
                    </div>
                    <div className='col-1 g-0'>
                      <div className='d-flex justify-content-start'>
                            <div><img src={infoImage} className='clickable invert' onClick={handleClick} alt='immagine link' width={30} height={30}></img></div>
                        </div>
                    </div>
                    <div className='col g-0' id='content'>
                        <div className='d-inline-flex align-items-center justify-content-center h-100 w-100'>
                            {/* Mostro il conteggio delle sedi */}
                            <span className='fs-4 fw-light'>TOTALE SEDI {sediCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WidgetSedi;