import './App.css';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import Utenti from './Components/Utenti/Utenti';
import Dashboard from './Components/Dashboard/Dashboard';
import Impostazioni from './Components/Impostazioni/Impostazioni';
import Sedi from './Components/Sedi/Sedi';
import Terreni from './Components/Terreni/Terreni';
import Magazzini from './Components/Magazzini/Magazzini';
import Macchinari from './Components/Macchinari/Macchinari';
import Strumenti from './Components/Strumenti/Strumenti';
import Prodotti from './Components/Prodotti/Prodotti';
import Agrofarmaci from './Components/Agrofarmaci/Agrofarmaci';
import Concimi from './Components/Concimi/Concimi';
import Fertilizzanti from './Components/Fertilizzanti/Fertilizzanti';
import Precipitazioni from './Components/Precipitazioni/Precipitazioni';
import CorrezioneTerreni from './Components/CorrezioneTerreni/CorrezioneTerreni';
import Produzioni from './Components/Produzione/Produzioni';
import Vendite from './Components/Vendite/Vendite';
import Perdite from './Components/Perdite/Perdite';
import Costi from './Components/Costi/Costi';

function App() {
  return (
    <div className="App">
      {/*istanzio la navbar in testa alla pagina*/}
      <Navbar/>
      {/*dichiaro le rotte per il routing 
        il componente da renderizzare inizialmente e' la dashboard
        tutti gli altri componenti saranno sempre renderizzati sotto la navbar
      */}  
     <Routes>
        <Route default path="/" element={<Dashboard/>} />
        <Route path="/utenti" element={<Utenti/>} />
        <Route path="/sedi" element={<Sedi/>} />
        <Route path="/terreni" element={<Terreni/>} />
        <Route path="/magazzini" element={<Magazzini/>} />
        <Route path="/macchinari" element={<Macchinari/>} />
        <Route path="/strumenti" element={<Strumenti/>} />
        <Route path="/prodotti" element={<Prodotti/>} />
        <Route path="/agrofarmaci" element={<Agrofarmaci/>} />
        <Route path="/concimi" element={<Concimi/>} />
        <Route path="/fertilizzanti" element={<Fertilizzanti/>} />
        <Route path="/precipitazioni" element={<Precipitazioni/>} />
        <Route path="/correzioniterreno" element={<CorrezioneTerreni/>} />
        <Route path="/produzioni" element={<Produzioni/>} />
        <Route path="/vendite" element={<Vendite/>} />
        <Route path="/perdite" element={<Perdite/>} />
        <Route path="/costi" element={<Costi/>} />
        <Route path="/impostazioni" element={<Impostazioni/>} />
      </Routes>

    </div>
  );
}

export default App;
