import './TimelineCorrezioneTerreno.css';
import React from 'react';
import concimeImage from '../../../Resources/concime.png'; 
import fertilizzanteImage from '../../../Resources/fertilizzante.png'; 

//Componente che renderizza una timeline per le correzioni dei terreni effettuate
const TimelineCorrezioneTerreno = ({ correzioneTerrenoData }) => {
    //Creo un array che servira' per mappare le immagini ai nomi delle correzioni
    const images = {
        'fertilizzante': fertilizzanteImage,
        'concime': concimeImage,
      };

    return (
        /* Timeline delle correzioni terreno */
        <div>
            <section className="pt-2 ps-5">
            {correzioneTerrenoData.map((item, index) => (
                <ul key={index} className="timeline">
                    {/* Per ogni entry di correzione terreno, se esistono dati di arricchimento, appendo un oggetto timeline (classe css di bootstrap) */}
                    {item.arricchimento !== undefined && item.arricchimento.length > 0 && (
                        <ul className="timeline-item mb-5">
                            <h5 className="fw-bold">{item.nome}</h5>
                            {/* La data viene mostrata con stile italiano */}
                            <p className="text-muted mb-2 fw-bold">{new Date(item.data).toLocaleDateString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                            <div className="text-muted">
                                {item.arricchimento.map((entry, index) => {
                                    //Cerco l'immagine da mostrare a seconda del nome dell'arricchimento
                                    let image = null;
                                    for (const [key, value] of Object.entries(images)) {
                                        if (entry.nome.toLowerCase().includes(key.toLowerCase())) {
                                            image = value;
                                            break;
                                        }
                                    }
                                    return (
                                    <li key={index} className="arricchimento-item no-style-li">
                                        {image && <img src={image} className='invert' alt={entry.nome} width="20" height="20"/>}
                                        <span>{entry.nome}</span>
                                        <br />
                                        {/* Con questa struttura mostro i dati di azoto, fosforo e potassio solo se esistono, altrimenti non li mostro */}
                                        {entry.azoto && (
                                            <>
                                                <span>Aumento Azoto: {entry.azoto}</span>
                                                <br />
                                            </>
                                        )}
                                        {entry.fosforo && (
                                            <>
                                                <span>Aumento Fosforo: {entry.fosforo}</span>
                                                <br />
                                            </>
                                        )}
                                        {entry.potassio && (
                                            <>
                                                <span>Aumento Potassio: {entry.potassio}</span>
                                                <br />
                                            </>
                                        )}
                                        <div className='d-flex justify-content-end pe-5'>
                                            {/* Il costo viene trasformato in tipologia monetaria con stile italiano */}
                                            <span className='fw-bold'>Costo: {entry.costo.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                                        </div>
                                    </li>
                                )})}
                            </div>
                        </ul>
                    )}
                </ul>
            ))}
            </section>
        </div>
    );
}

export default TimelineCorrezioneTerreno;