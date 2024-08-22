import './TablePrecipitazione.css';
import React from 'react';
import nuvolosoImage from '../../../Resources/nuvoloso.png'; 
import pioggiaImage from '../../../Resources/pioggia.png'; 
import soleggiatoImage from '../../../Resources/soleggiato.png'; 
import tempestaImage from '../../../Resources/tempesta.png'; 

//Componente che mostra i dati delle precipitazioni su una griglia, prende in input i dati delle perdite, la pagina corrente e il numero di oggetti da mostrare per pagina
const TablePrecipitazione = ({ precipitazioneData, currentPage, itemsPerPage }) => {
    return (
        <div>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th className="text-center" scope="col">Data</th>
                        <th className="text-center" scope="col">Tipologia Tempo</th>
                        <th className="text-center" scope="col">Lt/m²</th>
                        <th className="text-center" scope="col">Temperatura</th>
                    </tr>
                </thead>
                <tbody>
                    {precipitazioneData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                        <tr key={index}>
                            <td className='p-2 text-center'>{new Date(item.data).toLocaleDateString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                <td className='p-2 text-center'>
                                    {/* Mostro le immagini in base al nome di precipitazione */}
                                    {item.nome === 'Nuvoloso' ? <img src={nuvolosoImage} alt="" style={{width: "30px", height: "30px", marginRight: "10px"}}/> : item.nome === 'Pioggia' ? <img src={pioggiaImage} alt="" style={{width: "30px", height: "30px", marginRight: "10px"}}/> : item.nome === 'Soleggiato' ? <img src={soleggiatoImage} alt="" style={{width: "30px", height: "30px", marginRight: "10px"}}/> : item.nome === 'Tempesta' ? <img src={tempestaImage} alt="" style={{width: "30px", height: "30px", marginRight: "10px"}}/> : null} 
                                    <span>{item.nome}</span>
                                </td>
                            <td className='p-2 text-center'>{item.lt_m2 !== 0 ? item.lt_m2 : ''}</td>
                            <td className='p-2 text-center'>{item.temperatura} °C</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TablePrecipitazione;