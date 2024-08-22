import './Strumenti.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardStrumento from './CardStrumento/CardStrumento';

//Componente per la visualizzazione degli strumenti
//Diviso in due parti: il componente principale e quello dei singoli strumenti definito tramite CardStrumento
const Strumenti = () => {
    //Stato per memorizzare i dati degli strumenti
    const [strumenti, setStrumenti] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataStrumenti per ottenere i dati
    useEffect(() => {
        const fetchDataStrumenti = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultStrumenti = await getData('/api/data/strumentazione');
            //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
            setStrumenti(resultStrumenti);
          } catch (errore) {
            console.error('Errore caricamento dati strumenti:', errore);
          }
        };
        //Eseguo effettivamente la chiamata
        fetchDataStrumenti();
      }, []);

    return (
        <div className="m-4">
            <h3>Strumenti</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
                //Mappo i dati degli strumenti e genero un componente CardStrumento per ogni entry
                strumenti.map(strumento => {
                    return (
                      <div key={strumento.id} className='m-2'>
                        <CardStrumento key={strumento.id}
                          nome={strumento.nome}
                          costo={strumento.costo}
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

export default Strumenti;