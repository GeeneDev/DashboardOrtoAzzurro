import './CardUtente.css';
import React from 'react';
import userImage from '../../../Resources/user.png'; 

//Componente che renderizza un card per ogni utente
const CardUtente = ({ id, username, nome, cognome, tipocontratto, datainiziocontratto, datafinecontratto, costomensile, ruolo, sede }) => (
    <div className="card m-2" style={{'width': '18rem'}}>
        <img src={userImage} className="card-img-top w-50" alt='...'/>
            <div className="card-body">
                <h5 className="card-title">{username}</h5>
                <div className="card-text">
                    <span>Nome: {nome} {cognome}</span>
                    <br/>
                    <span>Tipo Contratto: {tipocontratto}</span>
                    <br/>
                    <span>Costo mensile: {costomensile.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    <br/>
                    {/* Con questa struttura se esiste una data di inzio contratto e una data di fine, li mostro, altrimenti nascondo il div che li contiene */}
                    {datainiziocontratto && datafinecontratto ? (
                        <div key={id+'contratto'}>
                            <span>Inizio Contratto: { new Date(datainiziocontratto).toISOString().split('T')[0]}</span>
                            <br/>
                            <span>Fine Contratto: {new Date(datafinecontratto).toISOString().split('T')[0]}</span>
                       </div>
                    ) : null}
                    <span>Ruolo: {ruolo}</span>
                    <br/>
                    <span>Sede: {sede}</span>
                </div>
            </div>
    </div>
);

export default CardUtente;