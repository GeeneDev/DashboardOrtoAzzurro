import './Navbar.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import userService from '../../Servizi/userService';
import userImage from '../../Resources/user.png'; 
import anagrficaImage from '../../Resources/anagrafica.png'; 
import sedeImage from '../../Resources/sede.png'; 
import terrenoImage from '../../Resources/terreno.png'; 
import magazzinoImage from '../../Resources/magazzino.png'; 
import macchinarioImage from '../../Resources/macchinario.png'; 
import strumentoImage from '../../Resources/strumento.png'; 
import prodottoImage from '../../Resources/prodotto.png'; 
import agrofarmacoImage from '../../Resources/agrofarmaco.png'; 
import concimeImage from '../../Resources/concime.png'; 
import fertilizzanteImage from '../../Resources/fertilizzante.png'; 
import precipitazioneImage from '../../Resources/precipitazione.png'; 
import produzioneImage from '../../Resources/produzione.png'; 
import venditaImage from '../../Resources/vendita.png'; 
import perditaImage from '../../Resources/perdita.png'; 
import costoImage from '../../Resources/costo.png'; 
import correzioneTerrenoImage from '../../Resources/correzioneterreno.png'; 
import impostazioneImage from '../../Resources/impostazione.png'; 
import logoutImage from '../../Resources/logout.png'; 

//Componente navbar presente su tutte le schermate, permette la navigazione della dashboard
//L'utente caricato dal servizio e' l'amministratore dell'azienda, inserito come mock user con valore dimostrativo
const Navbar = () => {
  //Stato per memorizzare l'utente correntemente loggato
  const [currentUser, setCurrentUser] = useState();
  //All'avvio del componente viene richiamata la funzione fetchDataDaServizioUtente per ottenere i dati dell'utente dal servizio utenti
  useEffect(() => {
    const fetchDataDaServizioUtente = async () => {
      try {
        //Chiamata asincrona verso il backend
        const userData = await userService.getCurrentUser();
        //Imposto lo stato dell'utente con i dati ottenuti dal servizio
        setCurrentUser(userData);
      } catch (error) {
        console.error('Errore caricamento dati da servizio utente:', error);
      }
    };
    //Eseguo effettivamente la funzione
    fetchDataDaServizioUtente();
  }, []);

    //Rendering del componente
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          {/* Intestazione dell'azienda, funge anche da ritorno alla dashboard */}
          <Link className="navbar-brand" to="/">OrtoAzzurro S.R.L.</Link>
          <div className="collapse navbar-collapse" id="navbarScroll">
            {/* Toggle per il dropdown menu anagrafica */}
            <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"  style={{"--bs-scroll-height" : "100px;"}}>
              <li className="nav-item dropdown">
                <button className="nav-link active dropdown-toggle" id="navbarScrollingDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src={anagrficaImage} className='me-1' alt='Immagine Anagrafica' width={20} />
                  <span>Anagrafica</span>
                </button>
                {/* Elenco degli elementi nel menu anagrafica, con Link navigano ai singoli componenti di dettaglio */}
                <ul className="dropdown-menu bg-primary" aria-labelledby="navbarScrollingDropdown">
                  <li><Link className="dropdown-item text-light" to="/utenti"><img src={userImage} className='me-1' alt='Immagine Utenti' width={20} /><span>Utenti</span></Link></li>
                  <li><Link className="dropdown-item text-light" to="/sedi"><img src={sedeImage} className='me-1' alt='Immagine Sedi' width={20} /><span>Sedi</span></Link></li>
                  <li><Link className="dropdown-item text-light" to="/terreni"><img src={terrenoImage} className='me-1' alt='Immagine Terreni' width={20} /><span>Terreni</span></Link></li>
                  <li><Link className="dropdown-item text-light" to="/magazzini"><img src={magazzinoImage} className='me-1' alt='Immagine Magazzini' width={20} /><span>Magazzini</span></Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item text-light" to="/macchinari"><img src={macchinarioImage} className='me-1' alt='Immagine Macchinari' width={20} /><span>Macchinari</span></Link></li>
                  <li><Link className="dropdown-item text-light" to="/strumenti"><img src={strumentoImage} className='me-1' alt='Immagine Strumenti' width={20} /><span>Strumenti</span></Link></li>
                  <li><Link className="dropdown-item text-light" to="/prodotti"><img src={prodottoImage} className='me-1' alt='Immagine Prodotti' width={20} /><span>Prodotti</span></Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item text-light" to="/agrofarmaci"><img src={agrofarmacoImage} className='me-1' alt='Immagine Agrofarmaci' width={20} /><span>Agrofarmaci</span></Link></li>
                  <li><Link className="dropdown-item text-light" to="/concimi"><img src={concimeImage} className='me-1' alt='Immagine Concimi' width={20} /><span>Concimi</span></Link></li>
                  <li><Link className="dropdown-item text-light" to="/fertilizzanti"><img src={fertilizzanteImage} className='me-1' alt='Immagine Fertilizzanti' width={20} /><span>Fertilizzanti</span></Link></li>
                </ul>
              </li>
              {/* Elementi in riga nella navbar dei componenti piu' importanti, con Link navigano ai singoli componenti */}
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/precipitazioni"><img src={precipitazioneImage} className='me-1' alt='Immagine Precipitazioni' width={20} /><span>Precipitazioni</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/produzioni"><img src={produzioneImage} className='me-1' alt='Immagine Produzione' width={20} /><span>Produzione</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/vendite"><img src={venditaImage} className='me-1' alt='Immagine Vendite' width={20} /><span>Vendite</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/perdite"><img src={perditaImage} className='me-1' alt='Immagine Perdite' width={20} /><span>Perdite</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/costi"><img src={costoImage} className='me-1' alt='Immagine Costi' width={20} /><span>Costi</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/correzioniterreno"><img src={correzioneTerrenoImage} className='me-1' alt='Immagine Correzioni Terreno' width={20} /><span>Correzioni Terreno</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/impostazioni"><img src={impostazioneImage} className='me-1' alt='Immagine Impostazioni' width={20} /><span>Impostazioni</span></Link>
              </li>
            </ul>
            {/* Sezione finale della navbar dove si mostra l'utente ed il bottone di logout */}
            <form className="d-flex flex-wrap align-items-center">
              <img src={userImage} height={20} alt='...'/>
              {/* Con questa struttura attendo che i dati dell'utente siano mostrabili */}
              {currentUser ? (
                <span className='text-light'>Utente: {currentUser.username}</span>
              ) : (
                <span className='text-light'>Utente: </span>
              )}
              {/* Bottone mock di funzione logout dell'utente */}
              <button className="ms-2 btn btn-primary" type="submit"><img src={logoutImage} className='me-1' alt='Immagine Logout' width={20} /><span>Logout</span></button>
            </form>
          </div>
        </div>
      </nav>
    );
};

export default Navbar;
