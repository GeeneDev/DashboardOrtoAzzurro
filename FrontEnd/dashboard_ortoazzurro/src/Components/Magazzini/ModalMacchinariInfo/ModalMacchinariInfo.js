import './ModalMacchinariInfo.css';
import React from 'react';
import macchinarioImage from '../../../Resources/macchinario.png'; 
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import { useEffect, useRef } from 'react';

//Componente modale per mostrare il contenuto della categoria per il magazzino su cui vengono aperte
//Sono passati come parametri data (i dati contenuti nella categoria scelta) e la funzione onClose che viene chiamata e rilanciata tramite callback al padre
const ModalMacchinariInfo = ({data, onClose}) => {
    //Riferimento all'elemento html, necessario per Resizable e Draggable
    const modalRef = useRef(null);
    //All'apertura del modale, calcolo la dimenzione della finestra necessaria a mostrare tutto il contenuto
    //Viene rilanciata per ogni modifica alla variabile Data
    useEffect(() => {
        //Se modalRef non e' nullo o undefined
        if (modalRef.current) {
            //Calcolo la dimenzione del contenuto
            const contentHeight = modalRef.current.clientHeight;
            const contentWidth = modalRef.current.clientWidth;
            //Imposto la dimenzione della finestra
            modalRef.current.style.height = `${contentHeight}px`;
            modalRef.current.style.width = `${contentWidth}px`;
        }
    }, [data]);

    //Calcolo il totale da mostrare in fondo alla finestra modale
    let totale = 0;
    data.forEach(item => {
        totale += item.quantita * item.costo;
    });

    //Rendering del componente
    return (
        //Permetto al contenuto di essere draggabile e resizable (non dall'utente, ma dal codice)
        <Draggable>
             <Resizable>
        {/* assegno il riferimento ref del primo elemento del modale per permettere il calcolo del contenuto */}
        <div className="modal" tabIndex="-1" ref={modalRef}>
            <div className="modal-dialog">
                {/* Definisco l'intestazione */}
                <div className="modal-content">
                    <div className="modal-header">
                        <img src={macchinarioImage} width={45} alt='...' className='pe-2 invert'/>
                        <h5 className="modal-title">Saldi Macchinari</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
                    </div>
                    {/* Appendo il contenuto */}
                    <div className="modal-body">
                        <div>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th className="text-center" scope="col">Nome</th>
                                        <th className="text-center" scope="col">Quantita</th>
                                        <th className="text-center" scope="col">Costo</th>
                                        <th className="text-center" scope="col">Costo Totale</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {/* Per ogni entry in data, renderizzo la riga e le celle */}
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        <td className='p-2'>{item.nome}</td>
                                        <td className='p-2 text-center'>{item.quantita}</td>
                                        {/* Il costo viene trasformato in tipologia monetaria con stile italiano */}
                                        <td className='p-2 text-center'>{item.costo.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td>
                                        {/* Il costo totale per riga viene trasformato in tipologia monetaria con stile italiano */}
                                        <td className='p-2 text-center'>{(item.costo * item.quantita).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className='d-flex justify-content-end align-items-end'>
                                {/* Il totale viene trasformato in tipologia monetaria con stile italiano */}
                                <span>Totale: {totale.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span><br/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Resizable>
        </Draggable>
    );
}

export default ModalMacchinariInfo;