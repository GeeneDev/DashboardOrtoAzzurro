import './Macchinari.css';
import React from 'react';
import { getData } from '../../Servizi/apiService';
import { useEffect, useState } from 'react';
import CardMacchinario from './CardMacchinario/CardMacchinario';

//Componente per la visualizzazione dei macchinari
//Diviso in due parti: il componente principale e quello dei singoli macchinari definito tramite CardMacchinario
const Macchinari = () => {
    //Stato per memorizzare i dati dei macchinari
    const [macchinari, setMacchinari] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataMacchinari per ottenere i dati
    useEffect(() => {
        const fetchDataMacchinari = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultMacchinari = await getData('/api/data/macchinari');
            //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
            setMacchinari(resultMacchinari);
          } catch (errore) {
            console.error('Errore caricamento dati macchinari:', errore);
          }
        };

        //Eseguo effettivamente la chiamata
        fetchDataMacchinari();
      }, []);
    
    //Rendering del componente
    return (
        <div className="m-4">
            <h3>Macchinari</h3>
            <div className='d-flex flex-wrap justify-content-start'>
            {
                //Mappo i dati dei macchinari e genero un componente CardMacchinario per ogni entry
                macchinari.map(macchinario => {
                    return (
                      <div key={macchinario.id} className='m-2'>
                          <CardMacchinario key={macchinario.id}
                            nome={macchinario.nome}
                            cv={macchinario.cv}
                            kw={macchinario.kw}
                            costo={macchinario.costo}
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

export default Macchinari;