import './WidgetVendite.css'
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getData } from '../../../Servizi/apiService';
import lattugaImage from '../../../Resources/lattuga.png'; 
import patataImage from '../../../Resources/patata.png'; 
import rosmarinoImage from '../../../Resources/rosmarino.png'; 
import carotaImage from '../../../Resources/carota.png'; 
import olivaImage from '../../../Resources/oliva.png'; 
import uvaImage from '../../../Resources/uva.png'; 
import infoImage from '../../../Resources/info.png';

//Componente widget per mostrare un riepilogo delle vendite per un numero di mesi scelto dall'utente (3,6,12 mesi)
const WidgetVendite = () => {
    //Riferimento alla funzione per navigare verso la pagina di dettaglio delle vendite
    const navigate = useNavigate();
    //Stato per memorizzare le vendite 
    const [vendite, setVendite] = useState([]);
    //Numero di mesi da mostrare, inizializzato a 3 mesi
    const [numeroMesi, setNumeroMesi] = useState(3); 
    //Funzione per settare il numero dei mesi da mostrare
    const handleButtonClick = (value) => () => {
        setNumeroMesi(value);
    };
    //Calcolo del valore totale delle vendite
    let valoreTotale = 0;
    vendite.forEach(item => {
        valoreTotale += item.valoreVendita;
    });
    //Array di oggetti per associare una chiave ad un'immagine, verra' usato dopo per associare i prodotti alla loro immagine
    const images = {
        'lattuga': lattugaImage,
        'patata': patataImage,
        'rosmarino': rosmarinoImage,
        'carota': carotaImage,
        'olive': olivaImage,
        'uva': uvaImage
      };

    //All'avvio del componente viene richiamata la funzione fetchDataVendite per ottenere i dati delle vendite
    //Viene chiamata anche quando cambia il numeroMesi
    useEffect(() => {
        const fetchDataVendite = async () => {
          try {
            //Creo una data attuale in formato ISO senza l'orario
            let oggi = new Date().toISOString().split('T')[0];
            //Creo una variable per indicare nella chiamata API la data di partenza della richiesta dati
            let numeroMesiIndietro = new Date();
            //Sottraggo il numero di mesi che voglio mostrare dalla data attuale
            numeroMesiIndietro.setMonth(numeroMesiIndietro.getMonth() - numeroMesi);
            //Formatto la data in ISO senza l'orario
            numeroMesiIndietro = numeroMesiIndietro.toISOString().split('T')[0];
            //Effettuo la chiamata al backend passando startDte e endDate
            const resultVendite = await getData(`/api/data/vendite?startDate=${numeroMesiIndietro}&endDate=${oggi}`);
            //Sorting dei dati ricevuti per data dal piu recente al meno recente
            resultVendite.sort((a, b) => new Date(b.data) - new Date(a.data));
            //Imposto i dati delle vendite
            setVendite(resultVendite);
          } catch (errore) {
            console.error('Errore caricamento dati vendite:', errore);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataVendite();
      }, [numeroMesi]);

    //Funzione per navigare alla pagina del dettaglio vendite
    function handleClick() {
        navigate("/vendite");
    }

    return (
        /* Imposto la tabella del riepilogo vendite */
        <div className='p-2 h-100'>
            <div className='border border-secondary bg-light d-flex flex-column h-100' style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: 'calc(100vh - 585px)' }}>
                {/* Definisco i bottoni per il filtraggio dei dati per mesi */}
                <div className='row'>
                    <div className='col-1 d-flex justify-content-center'>
                        <div className='d-flex justify-content-start'>
                            <div><img src={infoImage} className='clickable invert ms-2 mt-2' onClick={handleClick} alt='immagine link' width={30} height={30}></img></div>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='d-flex justify-content-end pt-1 pe-1 pb-1'>
                          <button type="button" className="btn btn-primary" onClick={handleButtonClick(3)}>3 mesi</button>   
                          <button type="button" className="btn btn-primary mx-2" onClick={handleButtonClick(6)}>6 mesi</button>    
                          <button type="button" className="btn btn-primary" onClick={handleButtonClick(12)}>12 mesi</button>   
                        </div>
                    </div>
                </div>
                {/* Intestazione della tabella con numeroMesi dinamicamente settato */}
                <div className='row clickable' onClick={handleClick}>
                    <div className='col-8 d-flex justify-content-center'>
                        <span className='fs-4'>Vendite Prodotti ultimi {numeroMesi} mesi</span>
                    </div>
                    <div className='col-3 d-flex justify-content-center'>
                        {/* Il valoreTotale viene trasformato in tipologia monetaria con stile italiano */}
                        <span className='fs-4 text-success'>{(valoreTotale).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
                    </div>
                </div>
                {/* Appendo la tabella delle vendite */}
                <div className='flex-grow-1'>
                    <table className="m-0 table table-bordered">
                        <thead>
                            <tr>
                                <th className="text-center" scope="col">Data</th>
                                <th className="text-center" scope="col">Prodotto</th>
                                <th className="text-center" scope="col">Quantita'</th>
                                <th className="text-center" scope="col">Valore</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Per ogni vendita creo una riga di tabella e le sue celle */}
                            {vendite.map((item, index) => {
                                //Associo le immagini ai prodotti
                                let image = null;
                                for (const [key, value] of Object.entries(images)) {
                                    if (item.prodotto.nome.toLowerCase().includes(key.toLowerCase())) {
                                        image = value;
                                        break;
                                    }
                                }
                                return(
                                    <tr key={item.id}>
                                        {/* Il valore della data viene impostato a stile italiano */}
                                        <td className='p-2 text-center'>{new Date(item.data).toLocaleDateString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                        <td className='p-2 d-flex align-items-center justify-content-between'>
                                            <span>{item.prodotto.nome}</span>
                                            {/* Se l'immagine e' stata trovata, la aggiungo alla riga */}
                                        {image && <img src={image} alt={item.prodotto.nome} width="20" height="20"/>}
                                        </td>
                                        <td className='p-2 text-center'>{item.quantita} {item.prodotto.unitamisura}</td>
                                        {/* Il valore vendita dell'entry viene trasformato in tipologia monetaria con stile italiano */}
                                        <td className='p-2 text-center text-success'>{(item.valoreVendita).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td>
                                    </tr>
                                )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )

}

export default WidgetVendite;