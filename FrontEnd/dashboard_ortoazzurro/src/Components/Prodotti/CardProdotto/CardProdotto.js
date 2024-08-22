import './CardProdotto.css';
import React from 'react';
import prodottoImage from '../../../Resources/prodotto.png'; 

//Componente che renderizza un card per ogni prodotto
const CardProdotto = ({ id, nome, unitamisura, pesokg, qualita, valoreunitario }) => (
    <div className="card h-100" style={{'width': '18rem'}}>
        <img src={prodottoImage} className="card-img-top w-50" alt='...'/>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{nome}</h5>
                <div className="card-text flex-grow-1 d-flex flex-column">
                    {/* Con questa struttura se la qualita' non e' disponibile, non viene mostrata */}
                    { qualita && (
                        <span>Qualita: {qualita}</span>
                    )}
                    <span>UM: {unitamisura}</span>
                    <span>Peso al {unitamisura}: {pesokg} Kg</span>
                    <div className='mt-auto d-flex justify-content-end'>
                        {/* Il costo viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='fs-5'>Costo: {(valoreunitario).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>
            </div>
    </div>
);

export default CardProdotto;