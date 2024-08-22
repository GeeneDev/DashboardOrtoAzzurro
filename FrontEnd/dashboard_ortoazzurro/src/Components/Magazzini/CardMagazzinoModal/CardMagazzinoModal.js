import './CardMagazzinoModal.css';
import React from 'react';
import magazzinoImage from '../../../Resources/magazzino.png'; 
import { useState } from 'react';
import ModalConcimiInfo from '../ModalConcimiInfo/ModalConcimiInfo';
import ModalFertilizzantiInfo from '../ModalFertilizzantiInfo/ModalFertilizzantiInfo';
import ModalAgrofarmaciInfo from '../ModalAgrofarmaciInfo/ModalAgrofarmaciInfo';
import ModalStrumentiInfo from '../ModalStrumentiInfo/ModalStrumentiInfo';
import ModalProdottiFinitiInfo from '../ModalProdottiFinitiInfo/ModalProdottiFinitiInfo';
import ModalMacchinariInfo from '../ModalMacchinariInfo/ModalMacchinariInfo';
import infoImage from '../../../Resources/info.png';

//Componente che renderizza un card per ogni magazzino
const CardMagazzinoModal = ({ id, nome, macchinari, concimi, fertilizzanti, agrofarmaci, strumenti, prodotti, valoreTotale }) => {
    //Stato per memorizzare lo stato della finestra modale macchinari
    const [isModalOpenMacchinari, setIsModalOpenMacchinari] = useState(false);
    //Stato per memorizzare lo stato della finestra modale concimi
    const [isModalOpenConcimi, setIsModalOpenConcimi] = useState(false);
    //Stato per memorizzare lo stato della finestra modale fertilizzanti
    const [isModalOpenFertilizzanti, setIsModalOpenFertilizzanti] = useState(false);
    //Stato per memorizzare lo stato della finestra modale agrofarmaci
    const [isModalOpenAgrofarmaci, setIsModalOpenAgrofarmaci] = useState(false);
    //Stato per memorizzare lo stato della finestra modale strumenti
    const [isModalOpenStrumenti, setIsModalOpenStrumenti] = useState(false);
    //Stato per memorizzare lo stato della finestra modale prodotti finiti
    const [isModalOpenProdottiFiniti, setIsModalOpenProdottiFiniti] = useState(false);

    //Funzione per aprire e chiudere la finestra modale dei macchinari
    const toggleModalMacchinari = () => {
        setIsModalOpenMacchinari(!isModalOpenMacchinari);
    };
    //Funzione per aprire e chiudere la finestra modale dei concimi
    const toggleModalConcimi = () => {
        setIsModalOpenConcimi(!isModalOpenConcimi);
    };
    //Funzione per aprire e chiudere la finestra modale dei fertilizzanti
    const toggleModalFertilizzanti = () => {
        setIsModalOpenFertilizzanti(!isModalOpenFertilizzanti);
    };
    //Funzione per aprire e chiudere la finestra modale degli agrofarmaci
    const toggleModalAgrofarmaci = () => {
        setIsModalOpenAgrofarmaci(!isModalOpenAgrofarmaci);
    };
    //Funzione per aprire e chiudere la finestra modale degli strumenti
    const toggleModalStrumenti = () => {
        setIsModalOpenStrumenti(!isModalOpenStrumenti);
    };
    //Funzione per aprire e chiudere la finestra modale dei prodotti finiti
    const toggleModalProdottiFiniti = () => {
        setIsModalOpenProdottiFiniti(!isModalOpenProdottiFiniti);
    };

    //Rendering del componente
    return (
        <div key={id} className="card h-100" style={{'width': '18rem'}}>
            <img src={magazzinoImage} className="card-img-top w-50" alt='...'/>
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">Magazzino {nome}</h5>
                <div className="card-text flex-grow-1 d-flex flex-column">
                {/* Con questa struttura se macchinari, concimi, fertilizzanti, agrofarmaci, strumenti o prodotti non sono presenti nel magazzino, non li mostro 
                    Al click della funzione associata si apre la Modal associata tramite la funzione    */}
                { macchinari.length > 0 && (
                    <div className="card w-100 clickable" onClick={toggleModalMacchinari}>
                         <div className="card-header">
                            <span><img src={infoImage} className='clickable invert me-1' alt='immagine link' width={25} height={25}></img>Macchinari</span>
                        </div>
                    </div>
                )}
                { concimi.length > 0 && (
                    <div className="card w-100 clickable" onClick={toggleModalConcimi}>
                         <div className="card-header">
                            <span><img src={infoImage} className='clickable invert me-1' alt='immagine link' width={25} height={25}></img>Concimi</span>
                        </div>
                    </div>
                )}
                { fertilizzanti.length > 0 && (
                    <div className="card w-100 clickable" onClick={toggleModalFertilizzanti}>
                         <div className="card-header">
                            <span><img src={infoImage} className='clickable invert me-1' alt='immagine link' width={25} height={25}></img>Fertilizzanti</span>
                        </div>
                    </div>
                )}
                { agrofarmaci.length > 0 && (
                    <div className="card w-100 clickable" onClick={toggleModalAgrofarmaci}>
                         <div className="card-header">
                            <span><img src={infoImage} className='clickable invert me-1' alt='immagine link' width={25} height={25}></img>Agrofarmaci</span>
                        </div>
                    </div>
                )}
                { strumenti.length > 0 && (
                    <div className="card w-100 clickable" onClick={toggleModalStrumenti}>
                         <div className="card-header">
                            <span><img src={infoImage} className='clickable invert me-1' alt='immagine link' width={25} height={25}></img>Strumenti</span>
                        </div>
                    </div>
                )}
                { prodotti.length > 0 && (
                    <div className="card w-100 clickable" onClick={toggleModalProdottiFiniti}>
                         <div className="card-header">
                            <span><img src={infoImage} className='clickable invert me-1' alt='immagine link' width={25} height={25}></img>Prodotti Finiti</span>
                        </div>
                    </div>
                )}
                    
                    <div className='mt-auto d-flex justify-content-end'>
                        <span className='fs-5'>Valore totale: {(valoreTotale).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>
            </div>
            {/* Definizione per istanziare le finestre modali per ogni categora, appaiono solo quando togglate
             la funzione onClose toggle e' passata come un callback dal figlio al padre per gestire lo show/hide della finestra */}
            {isModalOpenMacchinari && (
                <ModalMacchinariInfo data={macchinari} onClose={toggleModalMacchinari} />
            )}
            {isModalOpenConcimi && (
                <ModalConcimiInfo data={concimi} onClose={toggleModalConcimi} />
            )}
            {isModalOpenFertilizzanti && (
                <ModalFertilizzantiInfo data={fertilizzanti} onClose={toggleModalFertilizzanti} />
            )}
            {isModalOpenAgrofarmaci && (
                <ModalAgrofarmaciInfo data={agrofarmaci} onClose={toggleModalAgrofarmaci} />
            )}
            {isModalOpenStrumenti && (
                <ModalStrumentiInfo data={strumenti} onClose={toggleModalStrumenti} />
            )}
            {isModalOpenProdottiFiniti && (
                <ModalProdottiFinitiInfo data={prodotti} onClose={toggleModalProdottiFiniti} />
            )}
        </div>
    )
}

export default CardMagazzinoModal;