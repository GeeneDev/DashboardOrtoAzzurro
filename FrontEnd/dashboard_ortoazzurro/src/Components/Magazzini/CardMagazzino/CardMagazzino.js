//Componente deprecato, sostituito da CardMagazzinoModal
import './CardMagazzino.css';
import React from 'react';
import magazzinoImage from '../../../Resources/magazzino.png'; 
import { getData } from '../../../Servizi/apiService';
import { useEffect, useState } from 'react';

const CardMagazzino = ({ id, nome, macchinari, concimi, fertilizzanti, agrofarmaci, strumenti, prodotti }) => {
    const [macchinariData, setMacchinari] = useState([]);
    const [concimiData, setConcimi] = useState([]);
    const [fertilizzantiData, setFertilizzanti] = useState([]);
    const [agrofarmaciData, setAgrofarmaci] = useState([]);
    const [strumentiData, setStrumenti] = useState([]);
    const [prodottiData, setProdotti] = useState([]);

    useEffect(() => {
        const fetchDataMacchinari = async () => {
          try {
            const resultMacchinari = await getData('/api/data/macchinari');
            setMacchinari(resultMacchinari);
          } catch (errore) {
            console.error('Errore caricamento dati macchinari:', errore);
          }
        };
    
        fetchDataMacchinari();
    }, []);

    useEffect(() => {
        const fetchDataConcimi = async () => {
          try {
            const resultConcimi = await getData('/api/data/concimi');
            setConcimi(resultConcimi);
          } catch (errore) {
            console.error('Errore caricamento dati concimi:', errore);
          }
        };
    
        fetchDataConcimi();
    }, []);

    useEffect(() => {
        const fetchDataFertilizzanti = async () => {
          try {
            const resultFertilizzanti = await getData('/api/data/fertilizzanti');
            setFertilizzanti(resultFertilizzanti);
          } catch (errore) {
            console.error('Errore caricamento dati fertilizzanti:', errore);
          }
        };
    
        fetchDataFertilizzanti();
    }, []);

    useEffect(() => {
        const fetchDataAgrofarmaci = async () => {
          try {
            const resultAgrofarmaci = await getData('/api/data/agrofarmaci');
            setAgrofarmaci(resultAgrofarmaci);
          } catch (errore) {
            console.error('Errore caricamento dati agrofarmaci:', errore);
          }
        };
    
        fetchDataAgrofarmaci();
    }, []);

    useEffect(() => {
        const fetchDataStrumenti = async () => {
          try {
            const resultStrumenti = await getData('/api/data/strumentazione');
            setStrumenti(resultStrumenti);
          } catch (errore) {
            console.error('Errore caricamento dati strumenti:', errore);
          }
        };
    
        fetchDataStrumenti();
    }, []);

    useEffect(() => {
        const fetchDataProdotti = async () => {
          try {
            const resultProdotti = await getData('/api/data/prodotti');
            setProdotti(resultProdotti);
          } catch (errore) {
            console.error('Errore caricamento dati prodotti:', errore);
          }
        };
    
        fetchDataProdotti();
    }, []);

    return (
        <div className="card m-2" style={{'width': '18rem'}}>
            <img src={magazzinoImage} className="card-img-top w-50" alt='...'/>
                <div className="card-body">
                    <h5 className="card-title">Magazzino {nome}</h5>
                    <div className="card-text">
                        { macchinari.length > 0 && (
                            <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#macchinariCollapse${id}`} aria-expanded="false" aria-controls="macchinariCollapse">
                                <span>Macchinari</span>
                            </div>
                                <ul className="list-group list-group-flush collapse" id={`macchinariCollapse${id}`}>
                                    {
                                        macchinari.map(element => {
                                            const matchingMacchinari = macchinariData.find(macchinario => macchinario.id === element.id);
                                            if(matchingMacchinari){
                                                return (
                                                    <li key={`item-${element.id}-${matchingMacchinari ? matchingMacchinari.id : ''}`} className="list-group-item">
                                                        <span key={`nome-${matchingMacchinari ? matchingMacchinari.id : ''}`}>{matchingMacchinari.nome}</span>
                                                        <br />
                                                        {
                                                            matchingMacchinari.cv !== undefined && (
                                                                <>
                                                                    <span key={`cv-${matchingMacchinari ? matchingMacchinari.cv : ''}`}>CV: {matchingMacchinari.cv} </span>
                                                                    <br />
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            matchingMacchinari.kw !== undefined && (
                                                                <>
                                                                    <span key={`kw-${matchingMacchinari ? matchingMacchinari.kw : ''}`}>kW: {matchingMacchinari.kw} </span>
                                                                    <br />
                                                                </>
                                                            )
                                                        }
                                                        <span key={`quantita-${matchingMacchinari ? matchingMacchinari.id : ''}`}>Quantita: {element.quantita}</span>
                                                        <br />
                                                        <span key={`costo-${matchingMacchinari ? matchingMacchinari.id : ''}`}>Costo: {matchingMacchinari.costo} €</span>
                                                    </li>
                                                )
                                            } 

                                            return null;
                                        })
                                    }
                                </ul>
                            </div>
                        )}
                        { concimi.length> 0 && (
                            <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#concimiCollapse${id}`} aria-expanded="false" aria-controls="concimiCollapse">
                                <span>Concimi</span>
                            </div>
                                <ul className="list-group list-group-flush collapse" id={`concimiCollapse${id}`}>
                                    {
                                        concimi.map(element => {
                                            const matchingConcimi = concimiData.find(concime => concime.id === element.id);
                                            if(matchingConcimi){
                                                return (
                                                    <li key={`item-${element.id}-${matchingConcimi ? matchingConcimi.id : ''}`} className="list-group-item">
                                                        <span key={`nome-${matchingConcimi ? matchingConcimi.id : ''}`}>{matchingConcimi ? matchingConcimi.nome : ''}</span>
                                                        <br />
                                                        {
                                                            matchingConcimi.azoto !== undefined && (
                                                                <>
                                                                    <span key={`azoto-${matchingConcimi ? matchingConcimi.id : ''}`}>Azoto: {matchingConcimi.azoto} </span>
                                                                    <br />
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            matchingConcimi.fosforo !== undefined && (
                                                                <>
                                                                    <span key={`fosforo-${matchingConcimi ? matchingConcimi.id : ''}`}>Fosforo: {matchingConcimi.fosforo} </span>
                                                                    <br />
                                                                </>
                                                            )
                                                        }
                                                        {
                                                            matchingConcimi.potassio !== undefined && (
                                                                <>
                                                                    <span key={`potassio-${matchingConcimi ? matchingConcimi.id : ''}`}>Potassio: {matchingConcimi.potassio} </span>
                                                                    <br />
                                                                </>
                                                            )
                                                        }
                                                        <span key={`quantita-${matchingConcimi ? matchingConcimi.id : ''}`}>Quantita: {element.quantita}</span>
                                                        <br />
                                                        <span key={`costo-${matchingConcimi ? matchingConcimi.id : ''}`}>Costo: {matchingConcimi.costo} €</span>
                                                    </li>
                                                )
                                            }
                                            
                                            return null;
                                        })
                                    }
                                </ul>
                            </div>
                        )}
                        { fertilizzanti.length > 0 && (
                            <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#fertilizzantiCollapse${id}`} aria-expanded="false" aria-controls="fertilizzantiCollapse">
                                <span>Fertilizzanti</span>
                            </div>
                                <ul className="list-group list-group-flush collapse" id={`fertilizzantiCollapse${id}`}>
                                    {
                                        fertilizzanti.map(element => {
                                            const matchingFertilizzanti = fertilizzantiData.find(fertilizzante => fertilizzante.id === element.id);
                                            if(matchingFertilizzanti){
                                                return (
                                                    <li key={`item-${element.id}-${matchingFertilizzanti ? matchingFertilizzanti.id : ''}`} className="list-group-item">
                                                    <span key={`nome-${matchingFertilizzanti ? matchingFertilizzanti.id : ''}`}>{matchingFertilizzanti ? matchingFertilizzanti.nome : ''}</span>
                                                    <br />
                                                    <span key={`azoto-${matchingFertilizzanti ? matchingFertilizzanti.id : ''}`}>Azoto: {matchingFertilizzanti.azoto} </span>
                                                    <br />
                                                    <span key={`quantita-${matchingFertilizzanti ? matchingFertilizzanti.id : ''}`}>Quantita: {element.quantita}</span>
                                                    <br />
                                                    <span key={`costo-${matchingFertilizzanti ? matchingFertilizzanti.id : ''}`}>Costo: {matchingFertilizzanti.costo} €</span>
                                                </li>
                                                )
                                            }
                                            
                                            return null;
                                        })
                                    }
                                </ul>
                            </div>
                        )}
                        { agrofarmaci.length >0 && (
                            <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#agrofarmaciCollapse${id}`} aria-expanded="false" aria-controls="agrofarmaciCollapse">
                                <span>Agrofarmaci</span>
                            </div>
                                <ul className="list-group list-group-flush collapse" id={`agrofarmaciCollapse${id}`}>
                                    {
                                        agrofarmaci.map(element => {
                                            const matchingAgrofarmaci = agrofarmaciData.find(agrofarmaco => agrofarmaco.id === element.id);
                                            if(matchingAgrofarmaci){
                                                return(
                                                    <li key={`item-${element.id}-${matchingAgrofarmaci ? matchingAgrofarmaci.id : ''}`} className="list-group-item">
                                                        <span key={`nome-${matchingAgrofarmaci ? matchingAgrofarmaci.id : ''}`}>{matchingAgrofarmaci ? matchingAgrofarmaci.nome : ''}</span>
                                                        <br />
                                                        <span key={`quantita-${matchingAgrofarmaci ? matchingAgrofarmaci.id : ''}`}>Quantita: {element.quantita}</span>
                                                        <br />
                                                        <span key={`costo-${matchingAgrofarmaci ? matchingAgrofarmaci.id : ''}`}>Costo: {matchingAgrofarmaci.costo} €</span>
                                                    </li>
                                                )
                                            }
                                            return null;
                                        })
                                    }
                                </ul>
                            </div>
                        )}
                        { strumenti.length > 0 && (
                            <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#strumentiCollapse${id}`} aria-expanded="false" aria-controls="strumentiCollapse">
                                <span>Strumenti</span>
                            </div>
                                <ul className="list-group list-group-flush collapse" id={`strumentiCollapse${id}`}>
                                    {
                                        strumenti.map(element => {
                                            const matchingStrumenti = strumentiData.find(strumento => strumento.id === element.id);
                                            if(matchingStrumenti){
                                                return (
                                                    <li key={`item-${element.id}-${matchingStrumenti ? matchingStrumenti.id : ''}-${id}`} className="list-group-item">
                                                      <span key={`nome-${matchingStrumenti.id}`}>{matchingStrumenti.nome}</span>
                                                      <br />
                                                      <span key={`quantita-${element.id}`}>Quantita: {element.quantita}</span>
                                                      <br />
                                                      <span key={`costo-${matchingStrumenti.id}`}>Costo: {matchingStrumenti.costo} €</span>
                                                    </li>
                                                )
                                            }
                                            return null;
                                        })
                                    }
                                </ul>
                            </div>
                        )}
                        { prodotti.length > 0 && (
                            <div className="card w-100">
                            <div className="card-header" type="button" data-bs-toggle="collapse" data-bs-target={`#prodottiCollapse${id}`} aria-expanded="false" aria-controls="prodottiCollapse">
                                <span>Prodotti Finiti</span>
                            </div>
                                <ul className="list-group list-group-flush collapse" id={`prodottiCollapse${id}`}>
                                    {
                                        prodotti.map(element => {
                                            const matchingProdotti = prodottiData.find(prodotto => prodotto.id === element.id);
                                            if(matchingProdotti) {
                                                return (
                                                    <li key={`item-${element.id}-${matchingProdotti ? matchingProdotti.id : ''}`} className="list-group-item">
                                                        <span key={`nome-${matchingProdotti ? matchingProdotti.id : ''}`}>{matchingProdotti ? matchingProdotti.nome : ''}</span>
                                                        <br />
                                                        {
                                                            matchingProdotti.qualita !== undefined && (
                                                                <>
                                                                    <span key={`qualita-${matchingProdotti ? matchingProdotti.id : ''}`} className={`badge ${matchingProdotti.qualita === "bassa" ? "bg-secondary" : matchingProdotti.qualita === "media" ? "bg-primary" : matchingProdotti.qualita === "alta" ? "bg-success" : ""}`}>Qualita': {matchingProdotti.qualita}</span>
                                                                    <br />
                                                                </>
                                                            )
                                                        }
                                                        <span key={`unitamisura-${matchingProdotti ? matchingProdotti.id : ''}`}>UM: {matchingProdotti.unitamisura} </span>
                                                        <br />
                                                        <span key={`pesokg-${matchingProdotti ? matchingProdotti.id : ''}`}>Peso al KG: {matchingProdotti.pesokg} </span>
                                                        <br />
                                                        <span key={`quantita-${matchingProdotti ? matchingProdotti.id : ''}`}>Quantita: {element.quantita}</span>
                                                        <br />
                                                        <span key={`valoreunitario-${matchingProdotti ? matchingProdotti.id : ''}`}>Valore Unitario: {matchingProdotti.valoreunitario} €</span>
                                                    </li>
                                                )
                                            }
                                            return null;
                                        })
                                    }
                                </ul>
                            </div>
                        )}
                        
                    </div>
                    <div className='d-flex justify-content-end align-items-end'>
                        <div className=''>
                            <span>valore totale</span>
                        </div>
                    </div>
                </div>
        </div>
    );
}
    
export default CardMagazzino;