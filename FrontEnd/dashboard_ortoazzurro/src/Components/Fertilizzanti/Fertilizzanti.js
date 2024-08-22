import './Fertilizzanti.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardFertilizzante from './CardFertilizzante/CardFertilizzante';

//Componente per la visualizzazione dei fertilizzanti
//Diviso in due parti: il componente principale e quello dei singoli fertilizzanti definito tramite CardFertilizzante
const Fertilizzanti = () => {
    //Stato per memorizzare i dati dei fertilizzanti
    const [fertilizzanti, setFertilizzanti] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataFertilizzanti per ottenere i dati
    useEffect(() => {
        const fetchDataFertilizzanti = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultFertilizzanti = await getData('/api/data/fertilizzanti');
            //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
            setFertilizzanti(resultFertilizzanti);
          } catch (errore) {
            console.error('Errore caricamento dati fertilizzanti:', errore);
          }
        };
        //Eseguo effettivamente la chiamata
        fetchDataFertilizzanti();
      }, []);

    //Rendering del componente
    return (
        <div className="m-4">
            <h3>Fertilizzanti</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
                //Mappo i dati dei fertilizzanti e genero un componente CardFertilizzante per ogni entry
                fertilizzanti.map(fertilizzante => {
                    return (
                      <div key={fertilizzante.id} className='m-2'>
                        <CardFertilizzante key={fertilizzante.id}
                          nome={fertilizzante.nome}
                          azoto={fertilizzante.azoto}
                          costo={fertilizzante.costo}
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

export default Fertilizzanti;