import './CardMacchinario.css';
import React from 'react';
import macchinarioImage from '../../../Resources/macchinario.png'; 

//Componente che renderizza un card per ogni macchinario
const CardMacchinario = ({ id, nome, cv, kw, costo }) => (
    <div className="card h-100" style={{'width': '18rem'}}>
        <img src={macchinarioImage} className="card-img-top w-50" alt='...'/>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{nome}</h5>
                <div className="card-text flex-grow-1 d-flex flex-column">
                    {/* Con questa struttura se un macchinario non ha i dati di CV e kW non li renderizzo */}
                    {
                        cv !== undefined && (
                            <>
                                <span>CV: {cv}</span>
                                <br/>
                            </>
                            
                        )
                    }
                    {
                        kw !== undefined && (
                            <>
                                <span>kW: {kw}</span>
                                <br/>
                            </>
                        )
                    }
  
                    <div className='mt-auto d-flex justify-content-end'>
                        {/* Il costo viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='fs-5'>Costo: {(costo).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>
            </div>
    </div>
);


export default CardMacchinario;