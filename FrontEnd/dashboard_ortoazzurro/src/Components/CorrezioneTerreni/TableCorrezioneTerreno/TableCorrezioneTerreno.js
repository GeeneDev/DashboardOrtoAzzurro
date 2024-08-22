//Componente obsoleto, non utilizzato perche' di difficile lettura ed interpretazione, scelta timeline
import './TableCorrezioneTerreno.css';
import React from 'react';
import { useState } from 'react';

const TableCorrezioneTerreno = ({ correzioneTerrenoData}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const maxPages = Math.ceil(correzioneTerrenoData.length / itemsPerPage);

    return (
        <div>
            <nav aria-label="Pagination">
                <ul className="pagination d-flex justify-content-between w-50">
                    <li className="page-item" >
                        <button className="page-link" onClick={() => setCurrentPage(prevPage => Math.max(1, prevPage - 1))}>Indietro</button>
                    </li>
                    {currentPage < maxPages && (
                    <li className="page-item">
                        <button onClick={() => setCurrentPage(prevPage => prevPage + 1)} className="page-link">Avanti</button>
                    </li>
                    )}
                </ul>
            </nav>  
            <table className="table table-striped table-bordered w-50">
                <thead>
                    <tr>
                        <th className="text-center" scope="col">Data</th>
                        <th className="text-center" scope="col">Terreno</th>
                        <th className="text-center" scope="col">Livello Azoto</th>
                        <th className="text-center" scope="col">Livello Fosforo</th>
                        <th className="text-center" scope="col">Livello Nitrogeno</th>
                        <th className="text-center" scope="col">Livello Potassio</th>
                        <th className="text-center" scope="col">Livello Acqua</th>
                        <th className="text-center" scope="col">Arricchimento Eseguito</th>
                    </tr>
                </thead>
                <tbody>
                    {correzioneTerrenoData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                        <tr key={index}>
                            <td className='p-2 text-center'>{new Date(item.data).toLocaleDateString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td className='p-2 text-center'>{item.nome}</td>
                            <td className='p-2 text-center'>{item.azoto[0].livello !== 0 ? item.azoto[0].livello : ''}</td>
                            <td className='p-2 text-center'>{item.fosforo[0].livello !== 0 ? item.fosforo[0].livello : ''}</td>
                            <td className='p-2 text-center'>{item.nitrogeno[0].livello !== 0 ? item.nitrogeno[0].livello : ''}</td>
                            <td className='p-2 text-center'>{item.potassio[0].livello !== 0 ? item.potassio[0].livello : ''}</td>
                            <td className='p-2 text-center'>{item.acqua[0].livello !== 0 ? item.acqua[0].livello : ''}</td>
                            <td className='p-2'>
                            {item.arricchimento !== undefined && item.arricchimento.length > 0 && (
                                <div className="arricchimento-details">
                                    <ul>
                                        {item.arricchimento.map((entry, index) => (
                                        <li key={index} className="arricchimento-item">
                                            <span>{entry.nome}</span>
                                            <br/>
                                            {entry.azoto && (
                                                <>
                                                    <span>Aumento Azoto: {entry.azoto}</span>
                                                    <br/>
                                                </>
                                            )}
                                            {entry.fosforo && (
                                                <>
                                                    <span>Aumento Fosforo: {entry.fosforo}</span>
                                                    <br/>
                                                </>
                                            )}
                                            { entry.potassio && (
                                                <>
                                                    <span>Aumento Potassio: {entry.potassio}</span>
                                                    <br/>
                                                </>
                                            )}
                                            <span>Costo: {entry.costo}</span>
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableCorrezioneTerreno;