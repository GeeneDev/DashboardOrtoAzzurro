import './TableCosto.css';
import React from 'react';

//Componente che renderizza i dati in forma di tabella, prende in input i dati dei costi, la pagina corrente ed il numero di oggetti da mostrare
const TableCosto = ({ costoData, currentPage, itemsPerPage }) => {
    return (
        <div>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th className="text-center" scope="col">Data</th>
                        <th className="text-center" scope="col">Tipologia</th>
                        <th className="text-center" scope="col">Costo</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Filtro i dati dei costi per la pagina corrente ed il numero di oggetti da mostrare */}
                    {costoData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                        <tr key={item.id}>
                            {/* La data viene mostrata con stile italiano */}
                            <td className='p-2 text-center'>{new Date(item.data).toLocaleDateString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td className='p-2 text-center'>Costo del personale e perdita Prodotti Finiti</td>
                             {/* Il costo viene trasformato in tipologia monetaria con stile italiano ed artificiosamente messo a negativo, cosi da semplificare il funzionamento dei filtri in relazione al grafico*/}
                            <td className='p-2 text-center text-danger'>-{( item.costo).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TableCosto;