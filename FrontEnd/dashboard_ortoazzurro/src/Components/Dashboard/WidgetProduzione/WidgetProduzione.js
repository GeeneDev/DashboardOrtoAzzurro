import './WidgetProduzione.css'
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

//Componente widget per mostrare un riepilogo della produzione per un numero di mesi scelto dall'utente (3,6,12 mesi)
const WidgetProduzione = () => {
    //Riferimento alla funzione per navigare verso la pagina di dettaglio della produzione
    const navigate = useNavigate();
    //Stato per memorizzare la produzione 
    const [produzione, setProduzione] = useState([]);
    //Numero di mesi da mostrare, inizializzato a 3 mesi
    const [numeroMesi, setNumeroMesi] = useState(3); 
    //Funzione per settare il numero dei mesi da mostrare
    const handleButtonClick = (value) => () => {
      setNumeroMesi(value);
    };
    //Array di oggetti per associare una chiave ad un'immagine, verra' usato dopo per associare i prodotti alla loro immagine
    const images = {
      'lattuga': lattugaImage,
      'patata': patataImage,
      'rosmarino': rosmarinoImage,
      'carota': carotaImage,
      'olive': olivaImage,
      'uva': uvaImage
    };
    
    //All'avvio del componente viene richiamata la funzione fetchDataProduzioni per ottenere i dati della produzione
    //Viene chiamata anche quando cambia il numeroMesi
    useEffect(() => {
        const fetchDataProduzioni = async () => {
        //Creo una data attuale in formato ISO senza l'orario
        let oggi = new Date().toISOString().split('T')[0];
        //Creo una variable per indicare nella chiamata API la data di partenza della richiesta dati
        let numeroMesiIndietro = new Date();
        //Sottraggo il numero di mesi che voglio mostrare dalla data attuale
        numeroMesiIndietro.setMonth(numeroMesiIndietro.getMonth() - numeroMesi);
        //Formatto la data in ISO senza l'orario
        numeroMesiIndietro = numeroMesiIndietro.toISOString().split('T')[0];
          try {
            //Effettuo tutte le chiamate e ne attendo tutte le risposte con await Promise.all passando come parametri le date definite precedentemente
            const [resultProduzioni, resultProdotti] = await Promise.all([
              getData(`/api/data/produzione?startDate=${numeroMesiIndietro}&endDate=${oggi}`),
              getData('/api/data/prodotti')
            ]);
            //Sorting dei dati ricevuti per data dal piu recente al meno recente
            resultProduzioni.sort((a, b) => {
              return new Date(b.data).getTime() - new Date(a.data).getTime();
            });
            //Creo un array di oggetti che contiene tutte le produzioni con i nomi dei prodotti, unita di misura e qualita associati
            let resultProduzioniWithNomi = resultProduzioni.map((item) => ({
              ...item,
              produzione: item.produzione.map((prod) => {
                const matchedProdotto = resultProdotti.find(p => p.id === prod.id);
                return { ...prod, nome: matchedProdotto.nome, unitamisura: matchedProdotto.unitamisura, qualita: matchedProdotto.qualita };
              })
            }));
            //Imposto i dati della produzione
            setProduzione(resultProduzioniWithNomi);
          } 
          catch (errore) {
            console.error('Errore caricamento dati produzione:', errore);
          }
        };
        //Eseguo effettivamente le operazioni
        fetchDataProduzioni();
      }, [numeroMesi]);

    //Funzione per navigare alla pagina del dettaglio produzione
    function handleClick() {
        navigate("/produzioni");
    }

    return (
       /* Imposto la tabella del riepilogo produzione */
        <div className='p-2 h-100'>
            <div className='border border-secondary bg-light d-flex flex-column h-100' style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: 'calc(100vh - 585px)' }}>
              <div className='row'>
                <div className='col-1'>
                  <div className='d-flex justify-content-start'>
                      <div><img src={infoImage} className='clickable invert ms-2 mt-2' onClick={handleClick} alt='immagine link' width={30} height={30}></img></div>
                  </div>
                </div>
                {/* Intestazione della tabella con numeroMesi dinamicamente settato */}
                <div className='col-6'>
                  <div className='d-flex justify-content-end pt-1 pe-1 clickable' onClick={handleClick}>
                      <span className='fs-4'>Produzione ultimi {numeroMesi} mesi</span>
                  </div>
                </div>
                {/* Definisco i bottoni per il filtraggio dei dati per mesi */}
                <div className='col-5'>
                  <div className='d-flex justify-content-end pt-1 pe-1 pb-1'>
                      <button type="button" className="btn btn-primary" onClick={handleButtonClick(3)}>3 mesi</button>   
                      <button type="button" className="btn btn-primary mx-2" onClick={handleButtonClick(6)}>6 mesi</button>    
                      <button type="button" className="btn btn-primary" onClick={handleButtonClick(12)}>12 mesi</button>   
                  </div>
                </div>
              </div>
              <div className='flex-grow-1'>
                {/* Appendo la tabella delle vendite */}
                  <table className="m-0 table table-bordered">
                      <thead>
                          <tr>
                              <th className="text-center" scope="col">Data</th>
                              <th className="text-center" scope="col">Prodotto</th>
                              <th className="text-center" scope="col">Quantita'</th>
                          </tr>
                      </thead>
                      <tbody>
                        {/* Per ogni produzione creo una riga di tabella e le sue celle */}
                        {produzione.map((item) => (
                              item.produzione.map((prod) => {
                                  //Associo le immagini ai prodotti
                                  let image = null;
                                  for (const [key, value] of Object.entries(images)) {
                                      if (prod.nome.toLowerCase().includes(key.toLowerCase())) {
                                          image = value;
                                          break;
                                      }
                                  }
                                  return (
                                      <tr key={prod.id}>
                                          {/* Il valore della data viene impostato a stile italiano */}
                                          <td className='p-2 text-center'>{new Date(item.data).toLocaleDateString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' })}</td >
                                          <td className='p-2 d-flex align-items-center justify-content-between'>
                                              <span>{prod.nome}</span>
                                              {/* Se l'immagine e' stata trovata, la aggiungo alla riga */}
                                              {image && <img src={image} alt={prod.nome} width="20" height="20"/>}
                                          </td >
                                          <td className='p-2 text-center'>{prod.quantita} {prod.unitamisura}</td >
                                      </tr>
                                  )
                              })
                          ))}
                      </tbody>
                  </table>
              </div>
            </div>
        </div>
    )

}

export default WidgetProduzione;