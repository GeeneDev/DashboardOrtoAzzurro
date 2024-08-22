import './CardAgrofarmaco.css';
import React from 'react';
import agrofarmacoImage from '../../../Resources/agrofarmaco.png'; 

//Componente che renderizza un card per ogni agrofarmaco
const CardAgrofarmaco = ({ id, nome, costo }) => (
    <div className="card h-100" style={{'width': '18rem'}}>
        <img src={agrofarmacoImage} className="card-img-top w-50" alt='...'/>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{nome}</h5>
                <div className="card-text flex-grow-1 d-flex flex-column">
                    <div className='mt-auto d-flex justify-content-end'>
                        {/* Il costo viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='fs-5'>Costo: {(costo).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>
            </div>
    </div>
);

export default CardAgrofarmaco;