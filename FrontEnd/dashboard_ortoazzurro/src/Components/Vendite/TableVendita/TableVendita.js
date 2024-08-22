import './TableVendita.css';
import React from 'react';
import lattugaImage from '../../../Resources/lattuga.png'; 
import patataImage from '../../../Resources/patata.png'; 
import rosmarinoImage from '../../../Resources/rosmarino.png'; 
import carotaImage from '../../../Resources/carota.png'; 
import olivaImage from '../../../Resources/oliva.png'; 
import uvaImage from '../../../Resources/uva.png'; 

//Componente che mostra i dati delle vendite su una griglia, prende in input i dati delle vendite, la pagina corrente e il numero di oggetti da mostrare per pagina
const TableVendita = ({ venditaData, currentPage, itemsPerPage }) => {
    //Array di oggetti per associare una chiave ad un'immagine, verra' usato dopo per associare i prodotti alla loro immagine
    const images = {
        'lattuga': lattugaImage,
        'patata': patataImage,
        'rosmarino': rosmarinoImage,
        'carota': carotaImage,
        'olive': olivaImage,
        'uva': uvaImage
      };

    return (
        <div>
            {/*  Imposto la tabella del riepilogo vendite */ }
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th className="text-center" scope="col">Data</th>
                        <th className="text-center" scope="col">Prodotto</th>
                        <th className="text-center" scope="col">Quantita</th>
                        <th className="text-center" scope="col">Valore</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Per ogni vendita creo una riga di tabella e le sue celle e sincronizzo i dati da mostrare con quelli della pagina corrente ed il numero di elementi da mostrare */}
                    {venditaData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => {
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
                            <td className='p-2 text-center text-success'>{( item.valoreVendita).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
}

export default TableVendita;