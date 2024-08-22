import './CardConcime.css';
import React from 'react';
import concimeImage from '../../../Resources/concime.png'; 

//Componente che renderizza un card per ogni concime
const CardConcime = ({ id, nome, azoto, fosforo, potassio, costo }) => (
    <div className="card h-100" style={{'width': '18rem'}}>
        <img src={concimeImage} className="card-img-top w-50" alt='...'/>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{nome}</h5>
                <div className="card-text flex-grow-1 d-flex flex-column">
                    {/* tramite questa struttura se i dati azoto, fosforo e potassio non sono disponibili non vengono renderizzati, altrimenti vengono renderizzati */}
                    {
                        azoto !== undefined && (
                            <span>Azoto: {azoto}</span>
                        )
                    }
                    {
                        fosforo !== undefined && (
                            <span>Fosforo: {fosforo}</span>
                        )
                    }
                    {
                        potassio !== undefined && (
                            <span>Potassio: {potassio}</span>
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

export default CardConcime;