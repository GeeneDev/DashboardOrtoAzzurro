import './Dashboard.css';
import React from 'react';
import WidgetUtenti from './WidgetUtenti/WidgetUtenti';
import WidgetSedi from './WidgetSedi/WidgetSedi';
import WidgetTerreni from './WidgetTerreni/WidgetTerreni';
import WidgetMagazzini from './WidgetMagazzini/WidgetMagazzini';
import WidgetPrecipitazioni from './WidgetPrecipitazioni/WidgetPrecipitazioni';
import WidgetVendite from './WidgetVendite/WidgetVendite';
import WidgetProduzione from './WidgetProduzione/WidgetProduzione';
import WidgetValoreAziendale from './WidgetValoreAziendale/WidgetValoreAziendale';
import WidgetPerdite from './WidgetPerdite/WidgetPerdite';
import WidgetValoreMagazzini from './WidgetValoreMagazzini/WidgetValoreMagazzini';
import WidgetRicaviCosti from './WidgetRicaviCosti/WidgetRicaviCosti';

//Componente dashboard, e' strutturata utilizzando il grid system di bootstrap, il sizing dei componenti e' stato pensato per essere utilizzato da schermi
//di dimensioni 1920x1080 in su, ma sarebbe tranquillamente possibile adattare il layout a schermi di dimensioni inferiori gestendo il responsive design
//sono definite 4 righe di componenti, la prima mostra le precipitazioni in relazione alla produzione, la seconda mostra vendite, produzione e perdite di prodotti
//la terza riga ricavi e costi aziendali, valore dei beni aziendali divisi per categoria ed il valore dei magazzini
//la quarta mostra le statistiche sugli utenti, sedi, terreni e magazzini
//I componenti widget hanno un selettore di mesi (3,6,12 mesi) indipendenti, questo per permettere all'utente di scegliere come confrontare i dati
const Dashboard = () =>{
    return (
    <div>
      <div className='row g-0'>
        {/* Widget per mostrare relazioni tra precipitazioni, temperatura e produzione */}
        <WidgetPrecipitazioni/>
      </div>
      <div className='row g-0'>
        <div className='col-4'>
          {/* Widget per mostrare la produzione dei prodotti finiti */}
          <WidgetProduzione/>
        </div>
        <div className='col-4'>
          {/* Widget per mostrare le vendite realizzate */}
         <WidgetVendite/>
        </div>
        <div className='col-4'>
          {/* Widget per mostrare le perdite subite sui prodotti finiti */}
         <WidgetPerdite/>
        </div>
      </div>
      <div className='row g-0'>
        <div className='col-6'>
          {/* Widget per mostrare Ricavi,costi ed utili aziendali realizzati */}
          <WidgetRicaviCosti/>
        </div>
        <div className='col-3'>
          {/* Widget per mostrare il valore dei beni in possesso dell'azienda */}
          <WidgetValoreAziendale/>
        </div>
        <div className='col-3'>
          {/* Widget per mostrare come sono distribuiti i beni aziendali nei magazzini */}
          <WidgetValoreMagazzini/>
        </div>
      </div>
      <div className='row g-0'>
        <div className='col-3'>
          {/* Widget per mostrare quanti dipendenti sono al momento nell'azienda */}
          <WidgetUtenti/>
        </div>
        <div className='col-3'>
          {/* Widget per mostrare il numero di sedi aziendali*/}
          <WidgetSedi/>
        </div>
        <div className='col-3'>
          {/* Widget per mostrare il numero di terreni dell'azienda */}
          <WidgetTerreni/>
        </div>
        <div className='col-3'>
          {/* Widget per mostrare il numero di magazzini dell'azienda */}
          <WidgetMagazzini/>
        </div>
      </div>
    </div>
    
    )
};

export default Dashboard;