import './Prodotti.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardProdotto from './CardProdotto/CardProdotto';

//Componente per la visualizzazione dei prodotti finii
//Diviso in due parti: il componente principale e quello dei singoli prodotti definito tramite CardProdotto
const Prodotti = () => {
    //Stato per memorizzare i dati dei prodotti 
    const [prodotti, setProdotti] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataProdotti per ottenere i dati
    useEffect(() => {
        const fetchDataProdotti = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultProdotti = await getData('/api/data/prodotti');
            //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
            setProdotti(resultProdotti);
          } catch (errore) {
            console.error('Errore caricamento dati prodotti:', errore);
          }
        };
         //Eseguo effettivamente la chiamata
        fetchDataProdotti();
      }, []);
    
    //Rendering del componente
    return (
        <div className="m-4">
            <h3>Prodotti</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
                //Mappo i dati dei prodotti e genero un componente CardProdotto per ogni entry
                prodotti.map(prodotto => {
                    return (
                      <div key={prodotto.id} className='m-2'>
                        <CardProdotto key={prodotto.id}
                          nome={prodotto.nome}
                          unitamisura={prodotto.unitamisura}
                          pesokg={prodotto.pesokg}
                          qualita={prodotto.qualita}
                          valoreunitario={prodotto.valoreunitario}
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

export default Prodotti;