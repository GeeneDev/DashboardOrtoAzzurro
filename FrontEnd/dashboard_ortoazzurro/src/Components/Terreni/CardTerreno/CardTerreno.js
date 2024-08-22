import './CardTerreno.css';
import React from 'react';
import terrenoImage from '../../../Resources/terreno.png'; 
import { getData } from '../../../Servizi/apiService';
import { useEffect, useState } from 'react';

//Componente che renderizza un card per ogni terreno
//Vengono mostrati il nome, gli ettari e le colture sul terreno, i livelli di azoto, fosforo, potassio, nitrogeno ed acqua
//Specificatamente e' stato scelto di mostrare il livello iniziale dei parametri ed il decadimento giornaliero
//normalmente non avrebbe senso farlo, ma a scopo dimostrativo puo' risultare interessante per rendersi conto della redditivita'
//del terreno e quindi della sua produzione, dato che sono questi i parametri che definiscono la qualita e quantita' della produzione
//oltre che essere tenuti in considerazione per le azioni correttive del terreno, che appuno vanno a correggere questi livelli nel tempo
const CardTerreno = ({ id, nome, ettari, azoto, fosforo, potassio, nitrogeno, acqua, colture }) => {
    //Stato per memorizzare i dati delle colture
    const [coltureData, setColture] = useState([]);
    //All'avvio del componente viene richiamata la funzione fetchDataColture per ottenere i dati
    useEffect(() => {
        const fetchDataColture = async () => {
          try {
            //Chiamata asincrona verso il backend
            const resultColture = await getData('/api/data/prodotti');
            //Imposto lo stato con i dati ottenuti e lo rendo disponibile per il rendering
            setColture(resultColture);
          } catch (errore) {
            console.error('Errore caricamento dati colture:', errore);
          }
        };
        //Eseguo effettivamente la chiamata
        fetchDataColture();
    }, []);

    //Rendering del componente
    return (
        <div className="card m-2" style={{'width': '18rem'}}>
            <img src={terrenoImage} className="card-img-top w-50" alt='...'/>
                <div className="card-body">
                    <h5 className="card-title">{nome}</h5>
                    <div className="card-text">
                        <span>Ettari: {ettari} ha</span>
                        <br/>
                        {/* Con questa struttura se le colture non sono presenti, non le mostro */}
                        { colture.length > 0 &&(
                            <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#coltureCollapse${id}`} aria-expanded="false" aria-controls="coltureCollapse">
                                <span>Colture</span>
                            </div>
                                <ul className="list-group list-group-flush collapse" id={`coltureCollapse${id}`}>
                                    {
                                        /* Mappo gli id delle colture all'oggetto coltura, cosi' da ricavarne il nome */
                                        colture.map(element => {
                                            const matchingColtura = coltureData.find(coltura => coltura.id === element.id);
                                            if (matchingColtura) {
                                                return (
                                                    <li key={`item-${element.id}`} className="list-group-item">
                                                        <span>{matchingColtura.nome}</span>
                                                        <br />
                                                        <span>
                                                            Quantità: {element.quantita} ({matchingColtura.unitamisura})
                                                        </span>
                                                    </li>
                                                );
                                            }
                                        
                                            return null;
                                        })
                                    }
                                </ul>
                            </div>
                        )}
                        <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#azotoCollapse${id}`} aria-expanded="false" aria-controls="azotoCollapse">
                                <span>Azoto</span>
                            </div>
                            <ul className="list-group list-group-flush collapse" id={`azotoCollapse${id}`}>
                                {/* Mappo livello e decadimento per l'azoto e li inserisco in una lista */}
                                {azoto.map((element, index) => (
                                <li key={index} className="list-group-item">
                                    <span>Livello iniziale: {element.livello}</span>
                                    <br/>
                                    <span>Decadimento (gg): -{element.decadimento}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#fosforoCollapse${id}`} aria-expanded="false" aria-controls="fosforoCollapse">
                                <span>Fosforo</span>
                            </div>
                            <ul className="list-group list-group-flush collapse" id={`fosforoCollapse${id}`}>
                                 {/* Mappo livello e decadimento per il fosforo e li inserisco in una lista */}
                                {fosforo.map((element, index) => (
                                <li key={index} className="list-group-item">
                                    <span>Livello iniziale: {element.livello}</span>
                                    <br/>
                                    <span>Decadimento (gg): -{element.decadimento}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#potassioCollapse${id}`} aria-expanded="false" aria-controls="potassioCollapse">
                                <span>Potassio</span>
                            </div>
                            <ul className="list-group list-group-flush collapse" id={`potassioCollapse${id}`}>
                                 {/* Mappo livello e decadimento per il potassio e li inserisco in una lista */}
                                {potassio.map((element, index) => (
                                <li key={index} className="list-group-item">
                                    <span>Livello iniziale: {element.livello}</span>
                                    <br/>
                                    <span>Decadimento (gg): -{element.decadimento}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#nitrogenoCollapse${id}`} aria-expanded="false" aria-controls="nitrogenoCollapse">
                                <span>Nitrogeno</span>
                            </div>
                            <ul className="list-group list-group-flush collapse" id={`nitrogenoCollapse${id}`}>
                                 {/* Mappo livello e decadimento per il nitrogeno e li inserisco in una lista */}
                                {nitrogeno.map((element, index) => (
                                <li key={index} className="list-group-item">
                                    <span>Livello iniziale: {element.livello}</span>
                                    <br/>
                                    <span>Decadimento (gg): -{element.decadimento}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#acquaCollapse${id}`} aria-expanded="false" aria-controls="acquaCollapse">
                                <span>Acqua</span>
                            </div>
                            <ul className="list-group list-group-flush collapse" id={`acquaCollapse${id}`}>
                                 {/* Mappo livello e decadimento dell'acqua e li inserisco in una lista */}
                                {acqua.map((element, index) => (
                                <li key={index} className="list-group-item">
                                    <span>Livello iniziale: {element.livello}</span>
                                    <br/>
                                    <span>Decadimento (gg): -{element.decadimento}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
    );
}
    
export default CardTerreno;