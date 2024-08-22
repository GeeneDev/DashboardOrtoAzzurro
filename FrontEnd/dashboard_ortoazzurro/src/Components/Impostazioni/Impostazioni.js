import './Impostazioni.css';
import { getData } from '../../Servizi/apiService';
import React from 'react';

//Componente per le impostazioni, utilizzato per rendere disponibile la rigenerazione di un nuovo dataset senza passare per postman/curl
const Impostazioni = () => {
    //Funzione per richiamare la funzione di rigenerazione del dataset
    const RigeneraDataset = async () => {
        try {
            //Chiamata asincrona verso il backend
            const response = await getData('/api/data/genera-dataset');
            //Se ottengo risposta positiva, mostro un alert
            if (response.messaggio === "Dataset generato") {
                alert("Dataset rigenerato");
            }

        } catch (error) {
            console.error('Errore:', error);
        }
    };

    //Rendering del componente
    return (
        <div className='m-4'>
            <h3>Impostazioni</h3>
            <div className="card w-25">
                <h5 className="card-header">Rigenera Dataset</h5>
                <div className="card-body">
                    <p className="card-text">Clicca il bottone per generare un nuovo dataset completo</p>
                    {/* La pressione del bottone permette la rigenerazione di un nuovo dataset */}
                    <button onClick={RigeneraDataset} className="btn btn-primary">Rigenera Dataset</button>
                </div>
            </div>
        </div>
    );
};

export default Impostazioni;