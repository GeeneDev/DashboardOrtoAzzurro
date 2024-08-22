import './Agrofarmaci.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardAgrofarmaco from './CardAgrofarmaco/CardAgrofarmaco';

//Componente per la visualizzazione degli agrofarmaci
//Diviso in due parti: il componente principale e quello dei singoli agrofarmaci definito tramite CardAgrofarmaco
const Agrofarmaci = () => {
    //Stato per memorizzare i dati degli agrofarmaci
    const [agrofarmaci, setAgrofarmaci] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataAgrofarmaci per ottenere i dati
    useEffect(() => {
        const fetchDataAgrofarmaci = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultAgrofarmaci = await getData('/api/data/agrofarmaci');
            //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
            setAgrofarmaci(resultAgrofarmaci);
          } catch (errore) {
            console.error('Errore caricamento dati agrofarmaci:', errore);
          }
        };
        //Eseguo effettivamente la chiamata
        fetchDataAgrofarmaci();
      }, []);

    //Rendering del componente
    return (
        <div className="m-4">
            <h3>Agrofarmaci</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
                //Mappo i dati degli agrofarmaci e genero un componente CardAgrofarmaco per ogni entry
                agrofarmaci.map(agrofarmaco => {
                    return (
                      <div key={agrofarmaco.id} className='m-2'>
                        <CardAgrofarmaco key={agrofarmaco.id}
                          nome={agrofarmaco.nome}
                          costo={agrofarmaco.costo}
                        />
                      </div>
                    );
                  }
                )
            }
            </div>
        </div>
        );
}

export default Agrofarmaci;