import './CardSede.css';
import React from 'react';
import sedeImage from '../../../Resources/sede.png'; 
import { useNavigate } from 'react-router-dom';

//Componente che renderizza un card per ogni sede
const CardSede = ({ nome, indirizzo, citta, magazzini }) => {
    //Riferimento alla funzione per navigare verso la pagina di dettaglio magazzini
    const navigate = useNavigate();
    //Funzione per navigare alla pagina del dettaglio magazzini
    function handleClick() {
        navigate("/magazzini");
    }

    return (
        <div className="card m-2" style={{'width': '18rem'}}>
            <img src={sedeImage} className="card-img-top w-50" alt='...'/>
                <div className="card-body">
                    <h5 className="card-title">{nome}</h5>
                    <div className="card-text">
                        <span>Indirizzo: {indirizzo}</span>
                        <br/>
                        <span>Citta: {citta}</span>
                        {typeof magazzini !== 'undefined' && magazzini.length > 0 && (
                            <div>
                                {/* Per ogni magazzino renderizzo una card con il nome del magazzino a cui associo la funzione per navigare verso il componente dettaglio magazzini */}
                                {magazzini.map((magazzino, index) => (
                                    <div key={index} className="card w-100 clickable" onClick={handleClick}>
                                        <div className="card-header">
                                            <span>Magazzino {magazzino.nome}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
        </div>
    )
}


export default CardSede;