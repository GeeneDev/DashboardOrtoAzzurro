import './Concimi.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardConcime from './CardConcime/CardConcime';

//Componente per la visualizzazione dei concimi
//Diviso in due parti: il componente principale e quello dei singoli concimi definito tramite CardConcime
const Concimi = () => {
    //Stato per memorizzare i dati dei concimi
    const [concimi, setConcimi] = useState([]);
     //All'avvio del componente viene richiamata la funzione fetchDataConcimi per ottenere i dati
    useEffect(() => {
        const fetchDataConcimi = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultConcimi = await getData('/api/data/concimi');
             //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
            setConcimi(resultConcimi);
          } catch (errore) {
            console.error('Errore caricamento dati concimi:', errore);
          }
        };
         //Eseguo effettivamente la chiamata
        fetchDataConcimi();
      }, []);

    //Rendering del componente
    return (
        <div className="m-4">
            <h3>Concimi</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
                //Mappo i dati dei concimi e genero un componente CardConcime per ogni entry
                concimi.map(concime => {
                    return (
                      <div key={concime.id} className='m-2'>
                        <CardConcime key={concime.id}
                          nome={concime.nome}
                          azoto={concime.azoto}
                          fosforo={concime.fosforo}
                          potassio={concime.potassio}
                          costo={concime.costo}
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

export default Concimi;