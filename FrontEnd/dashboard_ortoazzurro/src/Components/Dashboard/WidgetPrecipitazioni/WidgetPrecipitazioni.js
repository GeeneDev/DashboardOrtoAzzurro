import './WidgetPrecipitazioni.css';
import React from 'react';
import { getData } from '../../../Servizi/apiService';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WidgetGraphPrecipitazione from './WidgetGraphPrecipitazione/WidgetGraphPrecipitazione';
import infoImage from '../../../Resources/info.png';

//Componente Widget per mostrare la relazione tra precipitazioni, temperatura e produzione
const WidgetPrecipitazioni = () => {
    //Stato per memorizzare i dati del grafico
    const [datiGrafico, setDatiGrafico] = useState([]);
    //Stato per memorizzare il numero di mesi correntemente mostrati, inizializzato a 3
    const [numeroMesi, setNumeroMesi] = useState(3); 
    //Stato per memorizzare il valore dello switch che mostra o rimuove l'area sottesa alle linee, inizializzato a true
    const [areaToggleValue, setAreaToggleValue] = useState(true); 
    //Stato per memorizzare il numero di giorni mostrati
    const [numeroGiorni, setNumeroGorni] = useState(0); 
    //Funzione per navigare verso la pagina delle precipitazioni
    const navigate = useNavigate();
    //Inizializzo la data corrente, serve per il calcolo dei mesi e dei giorni per il grafico
    const dataCorrente = new Date();
    //Array per memorizzare il numero di giorni nei mesi per il grafico
    const numeroGiorniNeiMesi = [];

    //All'avvio del componente viene richiamata la funzione fetchDataPrecipitazioni per ottenere i dati delle precipitazioni
    //Viene chiamata anche quando cambia il numeroMesi
    useEffect(() => {
      const fetchDataPrecipitazioni = async () => {
        //Creo una data attuale in formato ISO senza l'orario
        let oggi = new Date().toISOString().split('T')[0];
        //Creo una data iniziale che servira' per le chiamate verso il backend
        let dataIniziale = new Date();
        //Manipolo la data iniziale per settare i mesi all'indietro rispetto a quelli richiesti, ottenendo di fatto la data piu' lontana a sinistra del grafico
        dataIniziale.setMonth(dataIniziale.getMonth() - numeroMesi);
        //Formatto la data in formato ISO senza l'orario
        dataIniziale = dataIniziale.toISOString().split('T')[0];
        try {
          //Chiamate asincrone verso il backend per le precipitazioni e la produzione, specificando il data range desiderato
          const [resultPrecipitazioni, resultProduzioni] = await Promise.all([
            getData(`/api/data/precipitazioni?startDate=${dataIniziale}&endDate=${oggi}`),
            getData(`/api/data/produzione?startDate=${dataIniziale}&endDate=${oggi}`)
          ]);
          //Sorting delle precipitazioni dalla piu' recente a quella meno recente
          resultPrecipitazioni.sort((a, b) => new Date(b.data) - new Date(a.data));
          //Normalizzo le date per il grafico in formato ISO rimuovendo l'orario
          let precipitazioniDataNormalizzata = resultPrecipitazioni.map((item) => {
            return {
              ...item,
              data: new Date(item.data).toISOString().split('T')[0]
            };
            });
         
          //Calcolo quanto e' stato prodotto per ogni data disponibile, aggregato per data
          let produzioneAggregata = {};
          for (let i = 0; i < resultProduzioni.length; i++) {
            const item = resultProduzioni[i];
            if (!produzioneAggregata[item.data]) {
              produzioneAggregata[item.data] = 0;
            }
            for (let j = 0; j < item.produzione.length; j++) {
              produzioneAggregata[item.data] += item.produzione[j].quantita;
            }
          }
          //Costruisco un oggetto finale normalizzato che sia apprezzabile dal grafico
          let produzioneFinale = Object.entries(produzioneAggregata).map(([data, quantitaProduzione]) => ({ data: new Date(data).toISOString().split('T')[0], quantitaProduzione }));
          //Unisco i dati di precipitazioni e produzione per ogni data
          let mergedData = precipitazioniDataNormalizzata.map((precipitazione) => {
            const matchingProductionEntry = produzioneFinale.find(entry => entry.data === precipitazione.data);
            return {
              ...precipitazione,
              quantitaProduzione: matchingProductionEntry ? matchingProductionEntry.quantitaProduzione : null,
            };
          });
          //Imposto i dati del grafico con i dati normalizzati
          let datiGrafico = mergedData;
          setDatiGrafico(datiGrafico);
        } 
        catch (errore) {
          console.error('Errore caricamento dati:', errore);
        }
      };
      //Eseguo effettivamente le operazioni
      fetchDataPrecipitazioni();

      //Calcolo il numero dei giorni
      for (let i = 0; i < numeroMesi; i++) {
        const meseTmp = new Date(dataCorrente.getFullYear(), dataCorrente.getMonth() - i, 1);
        const numeroGiorni = new Date(meseTmp.getFullYear(), meseTmp.getMonth() + 1, 0).getDate();
        numeroGiorniNeiMesi.push(numeroGiorni);
      }
    
      let numeroGiorni = numeroGiorniNeiMesi[0];
      for (let i = 1; i < numeroGiorniNeiMesi.length; i++) {
          numeroGiorni += numeroGiorniNeiMesi[i];
      }
      //Imposto il numero dei giorni
      setNumeroGorni(numeroGiorni);
    }, [numeroMesi]);

    //Funzione per navigare al componente delle precipitazioni dettaglio
    function handleClick() {
        navigate("/precipitazioni");
    }

    //Funzione per gestire il cambio dei mesi da mostrare
    const handleButtonClick = (value) => () => {
      setNumeroMesi(value);
    };

    //Funzione per gestire lo switch dell'area sottesa alle linee del grafico
    const handleButtonClickAreaToggle = () => () => {
      setAreaToggleValue(!areaToggleValue);
    };

    return (
       <div className='p-2'>
            <div className='border border-secondary bg-light'>
              {/* Intestazione del grafico */}
              <div className='row g-0'>
                <div className='col-1'>
                  <div className='d-flex justify-content-start'>
                      <div><img src={infoImage} className='clickable invert ms-2 mt-2' onClick={handleClick} alt='immagine link' width={30} height={30}></img></div>
                  </div>
                </div>
                <div className='col-8'>
                  <div className='d-flex justify-content-center'>
                      <span className='fs-4'>Precipitazioni e Produzione ultimi {numeroMesi} mesi</span>
                  </div>
                </div>
                <div className='col-3'>
                  {/* Definisco i bottoni per il controllo dei mesi da mostrare e lo switch dell'area */}
                  <div className='d-flex justify-content-end pt-2 pe-2'>
                    <button type="button" className="btn btn-primary" onClick={handleButtonClick(3)}>3 mesi</button>   
                    <button type="button" className="btn btn-primary mx-2" onClick={handleButtonClick(6)}>6 mesi</button>    
                    <button type="button" className="btn btn-primary me-2" onClick={handleButtonClick(12)}>12 mesi</button>   
                    <button type="button" className="btn btn-secondary" onClick={handleButtonClickAreaToggle()}>Area on/off</button>  
                  </div>
                </div>
              </div>
              {/* Appendo il grafico al widget e do' la possibilita' di navigare al dettaglio delle precipitazioni tramite click sul grafico */}
              <div className='clickable' onClick={handleClick}>
                  {/* Passo al widget del grafico i dati da mostrare, una altezza(obbligatoria con l'uso della flexbox) il numero di giorni da mostrare e se mostrare l'area sottesa alle linee del grafico*/}
                  <WidgetGraphPrecipitazione data={datiGrafico} height={300} currentPage={1} itemsPerPage={numeroGiorni} areaToggle={areaToggleValue}/>
              </div>
            </div>
       </div>
    );
}

export default WidgetPrecipitazioni;