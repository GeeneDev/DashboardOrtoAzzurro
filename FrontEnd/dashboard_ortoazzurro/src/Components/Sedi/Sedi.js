import './Sedi.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardSedi from './CardSede/CardSede';

//Componente per la visualizzazione delle sedi
//Diviso in due parti: il componente principale e quello della singola sede definito tramite CardSedi
const Sedi = () => {
    //Stato per memorizzare i dati delle sedi
    const [sedi, setSedi] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchAllData per ottenere tutti i dati delle chiamate API attese tutte insieme
    useEffect(() => {
      const fetchAllData = async () => {
        try {
          //Effettuo tutte le chiamate e ne attendo tutte le risposte con await Promise.all
          const [magazziniResult, sediResult] = await Promise.all([
            getData('/api/data/magazzini'),
            getData('/api/data/sedi'),
          ]);
          //Per ogni sede tento di recuperare i dati del magazzino tramite gli id cosi' da assegnare i dati del magazzino all'array
          sediResult.forEach((sede) => {
            //Se la sede ha magazzini
            if (sede.magazzini !== undefined) {
              //Per ogni id di magazzino cerco di trovare il magazzino corrispondente
              sede.magazzini = sede.magazzini.map((idMagazzino) => {
                //Se lo trovo lo restituisco e sostituisco l'id con l'oggetto, altrimenti lascio l'id
                let matchedMagazzino = magazziniResult.find((mag) => {
                  return idMagazzino === mag.id;
                });

                return matchedMagazzino || idMagazzino;
              });
            }
          });
          //Imposto i dati delle sedi con i dati dei magazzini inseriti appropriatamente
          setSedi(sediResult);

        } catch (errore) {
          console.error('Errore caricamento dati:', errore);
        }
      };
      //Eseguo effettivamente le chiamate
      fetchAllData();
    }, []);
   
    //Rendering del componente
    return (
        <div className="m-4">
            <h3>Sedi</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
                //Mappo i dati delle sedi e genero un componente CardSedi per ogni entry
                sedi.map(sede => {
                    return (
                      <div key={sede.id}>
                        <CardSedi key={sede.id}
                          nome={sede.nome}
                          indirizzo={sede.indirizzo}
                          citta={sede.citta}
                          magazzini={sede.magazzini || undefined}
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

export default Sedi;