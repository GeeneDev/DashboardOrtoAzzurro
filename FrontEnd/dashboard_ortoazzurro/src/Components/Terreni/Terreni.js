import './Terreni.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardTerreno from './CardTerreno/CardTerreno';

//Componente per la visualizzazione dei terreni
//Diviso in due parti: il componente principale e quello dei singoli terreni definito tramite CardTerreno
const Terreni = () => {
    //Stato per memorizzare i dati dei terreni
    const [terreni, setTerreni] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataTerreni per ottenere i dati
    useEffect(() => {
        const fetchDataTerreni = async () => {
            try {
                //Chiamata asincrona verso il backend
                const resultTerreni = await getData('/api/data/terreni');
                //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
                setTerreni(resultTerreni);
            } catch (errore) {
                console.error('Errore caricamento dati terreni:', errore);
            }
        };
        //Eseguo effettivamente la chiamata
        fetchDataTerreni();
    }, []);

    //Rendering del componente
    return (
        <div className='m-4'>
            <h3>Terreni</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
              //Mappo i dati dei terreni e genero un componente CardTerreno per ogni entry
              terreni.map(terreno => {
                  return (
                    <div key={terreno.id}>
                      <CardTerreno key={terreno.id}
                        id={terreno.id}
                        nome={terreno.nome}
                        ettari={terreno.ettari}
                        azoto={terreno.azoto}
                        fosforo={terreno.fosforo}
                        potassio={terreno.potassio}
                        nitrogeno={terreno.nitrogeno}
                        acqua={terreno.acqua}
                        colture={terreno.colture}
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

export default Terreni;