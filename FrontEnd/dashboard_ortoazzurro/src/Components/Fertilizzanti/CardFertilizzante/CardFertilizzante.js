import './CardFertilizzante.css';
import React from 'react';
import fertilizzanteImage from '../../../Resources/fertilizzante.png'; 

//Componente che renderizza un card per ogni fertilizzante
const CardFertilizzante = ({ id, nome, azoto, costo }) => (
    <div className="card h-100" style={{'width': '18rem'}}>
        <img src={fertilizzanteImage} className="card-img-top w-50" alt='...'/>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{nome}</h5>
                <div className="card-text flex-grow-1 d-flex flex-column">
                    {/* Con questa struttura se azoto non e' presente non viene renderizzato lo span associato */}
                    {
                        azoto !== undefined && (
                            <span>Azoto: {azoto}</span>
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

export default CardFertilizzante;