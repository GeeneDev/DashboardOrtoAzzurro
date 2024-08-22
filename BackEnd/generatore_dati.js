const fs = require('fs');
const { faker } = require('@faker-js/faker/locale/it');

//Esporto la funzione per generare tutto il DataSet
module.exports = { generaDataSet };

//Definisco le variabili che serviranno in comune alle funzioni di generazione dati
const dataFine = new Date();
const dataInizio = new Date();
//Dalla data di oggi fino a 5 anni indietro
dataInizio.setFullYear(dataFine.getFullYear() - 5);

//Funzione per trovare la stagione, in base al numero di mese passato come parametro
function trovaStagione(mese) {
    //Da Gennaio a Marzo
    if (mese >= 0 && mese <= 2) return 'inverno';
    //Da Aprile a Giugno
    if (mese >= 3 && mese <= 5) return 'primavera';
    //Da Luglio a Settembre
    if (mese >= 6 && mese <= 8) return 'estate';
    //Da Ottobre a Dicembre
    return 'autunno';
};

//Funzione per arrotondare
function arrotonda2Decimali(numero) {
    return Math.round(numero * 100) / 100;
};

//Funzione per verificare esistenza degli id in un array
function verificaEsistenzaId(idObj, objects) {
    try {
        if (typeof idObj !== 'object' || idObj === null || idObj === undefined) {
            throw new TypeError('idObj non valido');
        }

        if (!Array.isArray(objects)) {
            throw new TypeError('objects non array');
        }

        if (typeof idObj.id === 'undefined') {
            throw new TypeError('idObj non ha id');
        }

        if (!objects.every(obj => obj && typeof obj.id !== 'undefined')) {
            throw new TypeError('non tutti gli oggetti hanno un id');
        }

        return objects.some(obj => obj.id == idObj.id);
    }
    catch (error) {
        console.log(`${error.message} con idObj: ${JSON.stringify(idObj)}, objects: ${JSON.stringify(objects)}`);
        return false;
    }
};

//Funzione per recuperare un oggetto con id specifico da un array
function getObjectById(idObj, objects) {
    try {
        if (typeof idObj !== 'object' || idObj === null || idObj === undefined) {
            throw new TypeError('idObj non valido');
        }

        if (!Array.isArray(objects)) {
            throw new TypeError('objects non array');
        }

        if (typeof idObj.id === 'undefined') {
            throw new TypeError('idObj non ha id');
        }

        if (!objects.every(obj => obj && typeof obj.id !== 'undefined')) {
            throw new TypeError('non tutti gli oggetti hanno un id');
        }

        return objects.find(obj => obj.id == idObj.id);
    } catch (error) {
        console.log(`${error.message} con idObj: ${JSON.stringify(idObj)}, objects: ${JSON.stringify(objects)}`);
        return undefined;
    }
};

//Funzione per generare dei costi/prezzi variabili in un intervallo base +- variazione
function generaDatiVariabili(costoBase, variazione) {
    const ulterioreVariazione = variazione / 5;
    const min = costoBase - variazione - ulterioreVariazione;
    const max = costoBase + variazione + ulterioreVariazione;
    return faker.number.float({ min: min, max: max, multipleOf: 0.01 });
};

//Funzione per generare i dati delle Precipitazioni
function generaPrecipitazioni() {
    const precipitazioniJson = [];

    //Definisco un array che riporta i possibili tempi di una stagione
    //Probabilita' stabilite ad intuito ed esperienza di vita
    const tipologiaPrecipitazioni = {
        inverno: [
            { nome: 'Soleggiato', probabilita: 0.05, lt_m2: 0, rangetemperatura: [2, 10] },
            { nome: 'Nuvoloso', probabilita: 0.45, lt_m2: 0, rangetemperatura: [-2, 8] },
            { nome: 'Pioggia', probabilita: 0.3, lt_m2: [20, 50], rangetemperatura: [2, 5] },
            { nome: 'Tempesta', probabilita: 0.2, lt_m2: [30, 50], rangetemperatura: [2, 5] },
        ],
        primavera: [
            { nome: 'Soleggiato', probabilita: 0.35, lt_m2: 0, rangetemperatura: [10, 25] },
            { nome: 'Nuvoloso', probabilita: 0.3, lt_m2: 0, rangetemperatura: [7, 15] },
            { nome: 'Pioggia', probabilita: 0.25, lt_m2: [20, 50], rangetemperatura: [5, 12] },
            { nome: 'Tempesta', probabilita: 0.1, lt_m2: [30, 60], rangetemperatura: [5, 10] },
        ],
        estate: [
            { nome: 'Soleggiato', probabilita: 0.75, lt_m2: 0, rangetemperatura: [25, 39] },
            { nome: 'Nuvoloso', probabilita: 0.1, lt_m2: 0, rangetemperatura: [20, 38] },
            { nome: 'Pioggia', probabilita: 0.1, lt_m2: [15, 50], rangetemperatura: [15, 20] },
            { nome: 'Tempesta', probabilita: 0.05, lt_m2: [20, 60], rangetemperatura: [14, 18] },
        ],
        autunno: [
            { nome: 'Soleggiato', probabilita: 0.1, lt_m2: 0, rangetemperatura: [5, 15] },
            { nome: 'Nuvoloso', probabilita: 0.45, lt_m2: 0, rangetemperatura: [3, 10] },
            { nome: 'Pioggia', probabilita: 0.35, lt_m2: [30, 60], rangetemperatura: [5, 8] },
            { nome: 'Tempesta', probabilita: 0.1, lt_m2: [35, 60], rangetemperatura: [3, 7] },
        ]
    };

    //Scelgo un tempo a caso in base alle probabilita' assegnate nel mese considerato usando una semplificazione del metodo dell'alias
    //https://en.wikipedia.org/wiki/Alias_method
    let id = 0;
    for (let dataGenerata = new Date(dataInizio); dataGenerata <= dataFine; dataGenerata.setDate(dataGenerata.getDate() + 1)) {
        const mese = dataGenerata.getMonth();
        const stagione = trovaStagione(mese);
        const listaTempo = tipologiaPrecipitazioni[stagione];

        let random = Math.random();

        //Scelgo quale tempo sara' con random - probabilita'
        let tempo;
        for (let i = 0; i < listaTempo.length; i++) {
            //Se random diventa 0 o minore a seguito della probabilita' considerata, lo scelgo come tempo 
            random = random - listaTempo[i].probabilita;
            if (random <= 0) {
                tempo = listaTempo[i];
                break;
            }
        }

        //Litri per metro quadro
        let lt_m2;
        //Se e' un array e' il range, quindi ne scelgo il valore tra min e max, multipleOf serve per definire il grado di precisione (decimali)
        if (Array.isArray(tempo.lt_m2))
            lt_m2 = faker.number.float({ min: tempo.lt_m2[0], max: tempo.lt_m2[1], multipleOf: 0.01 });
        //Altrimenti e' il valore di default
        else
            lt_m2 = tempo.lt_m2;

        //Come per lt_m2, sta volta il grado di precisione lo setto solo ad un decimale: non ha senso averne 2 per la temperatura
        const temperatura = faker.number.float({ min: tempo.rangetemperatura[0], max: tempo.rangetemperatura[1], multipleOf: 0.1 });

        //Inserisco i dati generati nell'array
        precipitazioniJson.push({
            id: id,
            nome: tempo.nome,
            lt_m2: parseFloat(lt_m2.toFixed(2)),
            temperatura: parseFloat(temperatura.toFixed(2)),
            data: new Date(dataGenerata)
        });

        id++;
    }

    //Scrivo il file e loggo
    fs.writeFileSync('Dataset_Precipitazioni.json', JSON.stringify(precipitazioniJson, null, 2), 'utf8');
    console.log('Dataset_Precipitazioni.json generato');

    return precipitazioniJson;
};

//Funzione per generare gli Utenti
function generaUtenti() {
    //Dipendenti fissi dell'azienda
    const utentiJson = [
        { id: 0, username: 'A.Rossi', nome: 'Alessandro', cognome: 'Rossi', tipocontratto: 'Indeterminato', ruolo: 'Admin', sede: 0, costomensile: 4500 },
        { id: 1, username: 'D.Greco', nome: 'Daniela', cognome: 'Greco', tipocontratto: 'Indeterminato', ruolo: 'Segretaria', sede: 0, costomensile: 3000 },
        { id: 2, username: 'C.Romano', nome: 'Carlo', cognome: 'Romano', tipocontratto: 'Indeterminato', ruolo: 'Ragioniere', sede: 0, costomensile: 3200 },
        { id: 3, username: 'B.Bianchi', nome: 'Bianca', cognome: 'Bianchi', tipocontratto: 'Indeterminato', ruolo: 'Logistica e Trasporti', sede: 0, costomensile: 3000 },
        { id: 4, username: 'E.Marino', nome: 'Enrico', cognome: 'Marino', tipocontratto: 'Indeterminato', ruolo: 'Capo Magazziniere', sede: 0, costomensile: 3000 },
        { id: 5, username: 'F.Ricci', nome: 'Francesca', cognome: 'Ricci', tipocontratto: 'Indeterminato', ruolo: 'Logistica e Trasporti', sede: 1, costomensile: 3200 },
        { id: 6, username: 'G.Lombardi', nome: 'Giorgio', cognome: 'Lombardi', tipocontratto: 'Indeterminato', ruolo: 'Logistica e Trasporti', sede: 1, costomensile: 3000 },
        { id: 7, username: 'G.Lombardi', nome: 'Giorgio', cognome: 'Lombardi', tipocontratto: 'Indeterminato', ruolo: 'Logistica e Trasporti', sede: 1, costomensile: 3000 },
        { id: 8, username: 'I.Conti', nome: 'Isabella', cognome: 'Conti', tipocontratto: 'Indeterminato', ruolo: 'Logistica e Trasporti', sede: 1, costomensile: 3000 },
        { id: 9, username: 'L.Gallo', nome: 'Luca', cognome: 'Gallo', tipocontratto: 'Indeterminato', ruolo: 'Coordinatore', sede: 2, costomensile: 3200 },
        { id: 10, username: 'M.Esposito', nome: 'Martina', cognome: 'Esposito', tipocontratto: 'Indeterminato', ruolo: 'Operaio', sede: 2, costomensile: 2800 },
        { id: 11, username: 'N.Bruno', nome: 'Nicola', cognome: 'Bruno', tipocontratto: 'Indeterminato', ruolo: 'Operaio', sede: 2, costomensile: 2800 },
        { id: 12, username: 'O.Ferrari', nome: 'Olivia', cognome: 'Ferrai', tipocontratto: 'Indeterminato', ruolo: 'Operaio', sede: 2, costomensile: 2800 },
        { id: 13, username: 'P.Fontana', nome: 'Paolo', cognome: 'Fontana', tipocontratto: 'Indeterminato', ruolo: 'Coordinatore', sede: 3, costomensile: 3200 },
        { id: 14, username: 'Q.Moretti', nome: 'Quirino', cognome: 'Moretti', tipocontratto: 'Indeterminato', ruolo: 'Operaio', sede: 3, costomensile: 2800 },
        { id: 15, username: 'R.Costa', nome: 'Rosalia', cognome: 'Costa', tipocontratto: 'Indeterminato', ruolo: 'Operaio', sede: 3, costomensile: 2800 },
        { id: 16, username: 'S.Rizzo', nome: 'Stefano', cognome: 'Rizzo', tipocontratto: 'Indeterminato', ruolo: 'Operaio', sede: 3, costomensile: 2800 },
        { id: 17, username: 'T.Galli', nome: 'Tiziana', cognome: 'Galli', tipocontratto: 'Indeterminato', ruolo: 'Coordinatore', sede: 4, costomensile: 3200 },
        { id: 18, username: 'U.DeLuca', nome: 'Umberto', cognome: 'De Luca', tipocontratto: 'Indeterminato', ruolo: 'Operaio', sede: 4, costomensile: 2800 },
        { id: 19, username: 'Z.Giordano', nome: 'Zeno', cognome: 'Giordano', tipocontratto: 'Indeterminato', ruolo: 'Operaio', sede: 4, costomensile: 2800 },
    ];

    //Genero dei dipendenti a tempo determinato per le sedi di lavoro, escludendo la sede 0 amministrativa
    //Lavorano per un mese per aiutare nella produzione
    let id= 20;
    for (let currentDate = new Date(dataInizio); currentDate <= dataFine; currentDate.setMonth(currentDate.getMonth() + 1)) {
        //definisco la datainiziocontratto e datafinecontratto per ogni mese
        let datainiziocontratto = new Date(currentDate);
        datainiziocontratto.setDate(1);
        let datafinecontratto = new Date(currentDate);
        datafinecontratto.setMonth(currentDate.getMonth() + 1);
        datafinecontratto.setDate(0);

        for (let i = 0; i < faker.number.int({min: 10, max: 15}); i++) {
            let nome = faker.person.firstName();
            let cognome = faker.person.lastName();
            let username = `${nome.charAt(0)}.${cognome}`;
            utentiJson.push({
                id: id,
                username: username,
                nome: nome,
                cognome: cognome,
                tipocontratto: 'Tempo Determinato',
                datainiziocontratto: datainiziocontratto,
                datafinecontratto: datafinecontratto,
                ruolo: 'Operaio',
                costomensile: 2400,
                sede: faker.number.int({ min: 1, max: 4 })
            });
            id++;
        }
    }  
   

    fs.writeFileSync('Dataset_Utenti.json', JSON.stringify(utentiJson, null, 2), 'utf8');
    console.log('Dataset_Utenti.json generato');

    return utentiJson;
};

//Funzione per generare i magazzini
function generaMagazzini() {
    //Imposto dei dati fissi nei magazzini per le varie categorie, i beni assegnati nei magazzini sono frutto di studio e ricerche effettuate
    //I dati dei magazzini verranno poi manipolati ulteriormente da altre funzioni, questi servono come base di dati fissi
    const magazziniJson = [
        {
            id: 0,
            nome: 'MP_MAG0',
            macchinari: [
                { id: 0, quantita: 1 },
                { id: 1, quantita: 1 },
                { id: 2, quantita: 1 },
                { id: 3, quantita: 1 },
            ],
            concimi: [],
            fertilizzanti: [],
            agrofarmaci: [],
            strumenti: [
                { id: 0, quantita: 100 },
                { id: 1, quantita: 200 },
                { id: 2, quantita: 10 },
                { id: 3, quantita: 10 },
                { id: 4, quantita: 20 },
                { id: 5, quantita: 100 },
                { id: 6, quantita: 20 },
                { id: 7, quantita: 10 },
                { id: 8, quantita: 10 },
                { id: 9, quantita: 10 },
                { id: 10, quantita: 10 },
                { id: 11, quantita: 10 },
            ],
            prodotti: []
        },
        { id: 1, nome: 'MP_MAG1', macchinari: [], concimi: [], fertilizzanti: [], agrofarmaci: [], strumenti: [], prodotti: [{ id: 20, quantita: 300 }, { id: 21, quantita: 3000 }] },
        {
            id: 2,
            nome: 'MP_MAG2',
            macchinari: [],
            concimi: [
                { id: 0, quantita: 50 },
                { id: 1, quantita: 25 },
                { id: 2, quantita: 100 },
                { id: 3, quantita: 150 },
                { id: 4, quantita: 150 },
            ],
            fertilizzanti: [
                { id: 0, quantita: 150 },
                { id: 1, quantita: 25 },
            ],
            agrofarmaci: [
                { id: 1, quantita: 10 },
                { id: 2, quantita: 10 },
                { id: 3, quantita: 20 },
                { id: 4, quantita: 20 },
                { id: 5, quantita: 70 },
                { id: 6, quantita: 50 },
                { id: 7, quantita: 15 },
            ],
            strumenti: [],
            prodotti: []
        },
        { id: 3, nome: 'MP_MAG3', macchinari: [], concimi: [], fertilizzanti: [], agrofarmaci: [], strumenti: [], prodotti: [] },
        {
            id: 4,
            nome: 'TA_MAG0',
            macchinari: [
                { id: 4, quantita: 1 },
                { id: 5, quantita: 1 },
                { id: 6, quantita: 1 },
                { id: 7, quantita: 1 },
            ],
            concimi: [
                { id: 0, quantita: 5 },
                { id: 1, quantita: 50 },
                { id: 2, quantita: 20 },
                { id: 3, quantita: 30 },
                { id: 4, quantita: 30 },
            ],
            fertilizzanti: [],
            agrofarmaci: [
                { id: 3, quantita: 10 },
                { id: 4, quantita: 5 },
            ],
            strumenti: [
                { id: 0, quantita: 500 },
                { id: 1, quantita: 100 },
                { id: 2, quantita: 3 },
                { id: 4, quantita: 5 },
                { id: 5, quantita: 100 },
                { id: 6, quantita: 16 },
                { id: 7, quantita: 4 },
                { id: 8, quantita: 4 },
                { id: 9, quantita: 4 },
                { id: 11, quantita: 4 },
                { id: 12, quantita: 4 },
                { id: 13, quantita: 1 },
            ],
            prodotti: []
        },
        {
            id: 5,
            nome: 'TV_MAG0',
            macchinari: [
                { id: 4, quantita: 1 },
                { id: 5, quantita: 1 },
                { id: 6, quantita: 1 },
                { id: 8, quantita: 1 },
                { id: 9, quantita: 1 },
                { id: 10, quantita: 1 },
                { id: 11, quantita: 1 },
            ],
            concimi: [
                { id: 0, quantita: 20 },
            ],
            fertilizzanti: [
                { id: 0, quantita: 30 },
            ],
            agrofarmaci: [
                { id: 2, quantita: 10 },
            ],
            strumenti: [
                { id: 1, quantita: 100 },
                { id: 3, quantita: 6 },
                { id: 2, quantita: 8 },
                { id: 4, quantita: 10 },
                { id: 6, quantita: 16 },
                { id: 7, quantita: 4 },
                { id: 8, quantita: 4 },
                { id: 9, quantita: 4 },
                { id: 10, quantita: 4 },
                { id: 11, quantita: 4 },
                { id: 14, quantita: 10 },
                { id: 13, quantita: 1 },
            ],
            prodotti: []
        },
        {
            id: 6,
            nome: 'TG_MAG0',
            macchinari: [
                { id: 4, quantita: 1 },
                { id: 5, quantita: 1 },
                { id: 6, quantita: 1 },
                { id: 7, quantita: 1 },
                { id: 12, quantita: 1 },
            ],
            concimi: [
                { id: 0, quantita: 20 },
            ],
            fertilizzanti: [
                { id: 0, quantita: 30 },
            ],
            agrofarmaci: [
                { id: 1, quantita: 15 },
                { id: 7, quantita: 10 },
            ],
            strumenti: [
                { id: 1, quantita: 100 },
                { id: 2, quantita: 4 },
                { id: 4, quantita: 14 },
                { id: 5, quantita: 40 },
                { id: 7, quantita: 4 },
                { id: 8, quantita: 4 },
                { id: 9, quantita: 4 },
                { id: 10, quantita: 4 },
                { id: 11, quantita: 4 },
                { id: 14, quantita: 4 },
            ],
            prodotti: []
        },

    ];

    fs.writeFileSync('Dataset_Magazzini.json', JSON.stringify(magazziniJson, null, 2), 'utf8');
    console.log('Dataset_Magazzini.json generato');

    return magazziniJson;
};

//Funzione per generare i Prodotti
function generaProdotti() {
    const prodottiJson = [
        { id: 0, nome: 'Lattuga bassa qualita', unitamisura: 'PZ', pesokg: 0.7, qualita: 'bassa', valoreunitario: generaDatiVariabili(1.5, 0.3) },
        { id: 1, nome: 'Lattuga media qualita', unitamisura: 'PZ', pesokg: 0.7, qualita: 'media', valoreunitario: generaDatiVariabili(2.0, 0.2) },
        { id: 2, nome: 'Lattuga alta qualita', unitamisura: 'PZ', pesokg: 0.7, qualita: 'alta', valoreunitario: generaDatiVariabili(2.5, 0.1) },
        { id: 3, nome: 'Rosmarino bassa qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'bassa', valoreunitario: generaDatiVariabili(8, 1) },
        { id: 4, nome: 'Rosmarino media qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'media', valoreunitario: generaDatiVariabili(9, 0.5) },
        { id: 5, nome: 'Rosmarino alta qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'alta', valoreunitario: generaDatiVariabili(11, 0.2) },
        { id: 6, nome: 'Patata bassa qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'bassa', valoreunitario: generaDatiVariabili(0.7, 0.05) },
        { id: 7, nome: 'Patata media qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'media', valoreunitario: generaDatiVariabili(0.8, 0.03) },
        { id: 8, nome: 'Patata alta qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'alta', valoreunitario: generaDatiVariabili(1, 0.01) },
        { id: 9, nome: 'Olive bassa qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'bassa', valoreunitario: generaDatiVariabili(5, 0.3) },
        { id: 10, nome: 'Olive media qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'media', valoreunitario: generaDatiVariabili(6, 0.2) },
        { id: 11, nome: 'Olive alta qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'alta', valoreunitario: generaDatiVariabili(6.5, 0.1) },
        { id: 12, nome: 'Uva bassa qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'bassa', valoreunitario: generaDatiVariabili(7, 0.3) },
        { id: 13, nome: 'Uva media qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'media', valoreunitario: generaDatiVariabili(8, 0.2) },
        { id: 14, nome: 'Uva alta qualita', unitamisura: 'PZ', pesokg: 1, qualita: 'alta', valoreunitario: generaDatiVariabili(9, 0.1) },
        { id: 15, nome: 'Pianta Olivo', unitamisura: 'N', pesokg: 120, valoreunitario: generaDatiVariabili(2000, 130) },
        { id: 16, nome: 'Pianta Vite', unitamisura: 'N', pesokg: 0.1, valoreunitario: generaDatiVariabili(5, 0.3) },
        { id: 17, nome: 'Pianta Lattuga', unitamisura: 'N', pesokg: 0.7, valoreunitario: generaDatiVariabili(5, 0.3) },
        { id: 18, nome: 'Pianta Rosmarino', unitamisura: 'N', pesokg: 0.2, valoreunitario: generaDatiVariabili(10, 0.5) },
        { id: 19, nome: 'Pianta Patata', unitamisura: 'N', pesokg: 0.15, valoreunitario: generaDatiVariabili(1, 0.1) },
        { id: 20, nome: 'Semente Lattuga', unitamisura: 'KG', pesokg: 1, valoreunitario: generaDatiVariabili(1.2, 0.1) },
        { id: 21, nome: 'Semente Erba Medica', unitamisura: 'KG', pesokg: 1, valoreunitario: generaDatiVariabili(2.5, 0.3) },
    ];

    fs.writeFileSync('Dataset_Prodotti.json', JSON.stringify(prodottiJson, null, 2), 'utf8');
    console.log('Dataset_Prodotti.json generato');

    return prodottiJson;
};

//Funzione per generare la produzione mensile di prodotti finiti
function generaProduzione(correzioniTerreno) {
    //Creo l'array che conterra' la produzione
    const Produzione = [];
    //Inizializzo l'id iniziale della produzione, incrementato ogni ciclo
    let id = 0;

    //Variabile per saltare il ciclo in caso si sia usato un dato di correzione terreno
    let skipNext = false;
    for(let i=0; i < correzioniTerreno.length; i++){
        //Inizializzo le variabili necessarie al calcolo della produzione
        let dataCorrezione;
        let datiDaUsare;
        //Data da prendere in considerazione
        let data = new Date(correzioniTerreno[i].data);
        //Dati da prendere in considerazione inizialmente
        datiDaUsare = correzioniTerreno[i];
        
        //Se esiste nel prossimo ciclo una data che non vada out of bounds, la imposto come data di correzione terreno (perche le correzioni terreno sono sempre segnate in due giorni, il primo senza correzioni il successivo con correzioni)
        if( i + 1 < correzioniTerreno.length)
            dataCorrezione = new Date(correzioniTerreno[i+1].data)
    
        //Se ci sono dati con correzioni, li preferisco rispetto ai dati senza correzioni in quanto si ipotizza un raccolto successivo alla data di correzione terreno (la produzione viene registrata il 15 del mese)
        if(dataCorrezione != undefined && dataCorrezione.getMonth() == data.getMonth()){
            datiDaUsare = correzioniTerreno[i+1];
            skipNext = true;
        }

        //definisco le qualita' per azoto, fosforo, potassio, nitrogeno
        //uso queste qualita' successivamente per definire le qualita' del prodotto che viene raccolto
        //Qualita' piu' alte hanno un valore di mercato piu' alto
        let azotoQualita = 0;
        if (datiDaUsare.azoto[0].livello >= 30 && datiDaUsare.azoto[0].livello <= 50)
            azotoQualita = 1;
        if (datiDaUsare.azoto[0].livello >= 50 && datiDaUsare.azoto[0].livello <= 60)
            azotoQualita = 2;
        if (datiDaUsare.azoto[0].livello >= 60)
            azotoQualita = 3;
    
        let fosforoQualita = 0;
        if (datiDaUsare.fosforo[0].livello >= 30 && datiDaUsare.fosforo[0].livello <= 50)
            fosforoQualita = 1;
        if (datiDaUsare.fosforo[0].livello >= 50 && datiDaUsare.fosforo[0].livello <= 60)
            fosforoQualita = 2;
        if (datiDaUsare.fosforo[0].livello >= 60)
            fosforoQualita = 3;
    
        let potassioQualita = 0;
        if (datiDaUsare.potassio[0].livello >= 30 && datiDaUsare.potassio[0].livello <= 50)
            potassioQualita = 1;
        if (datiDaUsare.potassio[0].livello >= 50 && datiDaUsare.potassio[0].livello <= 60)
            potassioQualita = 2;
        if (datiDaUsare.potassio[0].livello >= 60)
            potassioQualita = 3;
    
        let nitrogenoQualita = 0;
        if (datiDaUsare.nitrogeno[0].livello >= 30 && datiDaUsare.nitrogeno[0].livello <= 50)
            nitrogenoQualita = 1;
        if (datiDaUsare.nitrogeno[0].livello >= 50 && datiDaUsare.nitrogeno[0].livello <= 60)
            nitrogenoQualita = 2;
        if (datiDaUsare.nitrogeno[0].livello >= 60)
            nitrogenoQualita = 3;
    
        //Produzione lattuga ID 0 1 2 , rosmarino ID 3 4 5 , patata ID 6 7 8, olive ID 9 10 11, vite 11 12 13
        //lattuga 20000kg per ettaro
        //rosmarino 20000kg per ettaro
        //patata 20000kg per ettaro
        
        //Contatori per definire se ho valori alti o medi in base a se le variabili di qualita sono almeno 2 per i medi e 3 per gli alti
        let counterAlta = [azotoQualita, fosforoQualita, potassioQualita, nitrogenoQualita].filter(val => val == 3).length;
        let counterMedia = [azotoQualita, fosforoQualita, potassioQualita, nitrogenoQualita].filter(val => val == 2).length;

        //istanzio una nuova data
        let dataDaUsare = new Date(datiDaUsare.data);

        //Preparo l'array di produzione che conterra' i prodotti che vengono raccolti
        let produzione = [];
        //Produco un raccolto di qualita alta se ho un numero di valori nel counterAlta dispari e quindi ho una qualita alta

        //I valori di quantita' che andranno sotto ad essere riempiti sono scostati dal 10% al 15% per generare varianza sul raccolto e non avere sempre gli stessi dati
        if (counterAlta % 2 !== 0) {
            for (let coltura of datiDaUsare.colture){
                //Nei mesi di ottobre e novembre produco olivo
                if(dataDaUsare.getMonth() == 9 || dataDaUsare.getMonth() == 10){
                    //Pianta Olivo
                    if(coltura.id == 15){
                        produzione.push({ id: 11, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                    }
                }
                //Nei mesi di settembre e ottobre produco uva
                if(dataDaUsare.getMonth() == 8 || dataDaUsare.getMonth() == 9){
                    //Pianta Vite
                    if(coltura.id == 16){
                        produzione.push({ id: 14, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                    }
                }
                //In tutti gli altri mesi produco lattuga, rosmarino e patata
                //Pianta Lattuga
                if(coltura.id == 17){
                    produzione.push({ id: 2, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
                //Pianta Rosmarino
                if(coltura.id == 18){
                    produzione.push({ id: 5, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
                //Pianta Patata
                if(coltura.id == 19){
                    produzione.push({ id: 8, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
            }
        }
        //Produco un raccolto di qualita media se ho un numero di valori pari nel counterMedia e quindi ho una qualita' media
        else if (counterMedia % 2 !== 0) {
            for (let coltura of datiDaUsare.colture){
                //Nei mesi di ottobre e novembre produco olivo
                if(dataDaUsare.getMonth() == 9 || dataDaUsare.getMonth() == 10){
                    //Pianta Olivo
                    if(coltura.id == 15){
                        produzione.push({ id: 10, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                    }
                }
                //Nei mesi di settembre e ottobre produco uva
                if(dataDaUsare.getMonth() == 8 || dataDaUsare.getMonth() == 9){
                    //Pianta Vite
                    if(coltura.id == 16){
                        produzione.push({ id: 13, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                    }
                }
                //Pianta Lattuga
                if(coltura.id == 17){
                    produzione.push({ id: 1, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
                //In tutti gli altri mesi produco lattuga, rosmarino e patata
                //Pianta Rosmarino
                if(coltura.id == 18){
                    produzione.push({ id: 4, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
                //Pianta Patata
                if(coltura.id == 19){
                    produzione.push({ id: 7, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
            }
        }
        //Produco un raccolto di qualita bassa se nessuna delle condizioni precedenti si e' verificata
        else {
            for (let coltura of datiDaUsare.colture){
                //Nei mesi di ottobre e novembre produco olivo
                if(dataDaUsare.getMonth() == 9 || dataDaUsare.getMonth() == 10){
                    //Pianta Olivo
                    if(coltura.id == 15){
                        produzione.push({ id: 9, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                    }
                }
                //Nei mesi di settembre e ottobre produco uva
                if(dataDaUsare.getMonth() == 8 || dataDaUsare.getMonth() == 9){
                    //Pianta Vite
                    if(coltura.id == 16){
                        produzione.push({ id: 12, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                    }
                }
                //In tutti gli altri mesi produco lattuga, rosmarino e patata
                //Pianta Lattuga
                if(coltura.id == 17){
                    produzione.push({ id: 0, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
                //Pianta Rosmarino
                if(coltura.id == 18){
                    produzione.push({ id: 3, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
                //Pianta Patata
                if(coltura.id == 19){
                    produzione.push({ id: 6, quantita: coltura.quantita - faker.number.int({ min: Math.floor((coltura.quantita * 0.1)), max: Math.floor((coltura.quantita * 0.15)) })});
                }
            }
        }

        //Se alla fine di questo ciclo ho dei dati di produzione, li inserisco nell'array finale Produzione, assegnando la data al 15 del mese alle 5
        if(produzione.length > 0){
            let dataFinale = new Date(dataDaUsare.getFullYear(), dataDaUsare.getMonth(), 15,5,0,0,0);
            //La produzione viene registrata il 15 del mese, se non siamo ancora al 15 del mese ed anno corrente, va saltata in quanto produrremmo nel futuro
            if(dataFinale > new Date())
                continue;

            Produzione.push({id: id, produzione, data: dataFinale});
            id++;
        }

      
        //Salto correzioniTerreno[i+1] se ho già usato quello al posto di quello corrente
        if(skipNext == true) {
            i++; 
            skipNext = false;
            continue;
        }
    }

    fs.writeFileSync('Dataset_ProduzioneProdotti.json', JSON.stringify(Produzione, null, 2), 'utf8');
    console.log('Dataset_ProduzioneProdotti.json generato');

    return Produzione;
};

//Funzione per generare le Vendite
function generaVendite(produzioneProdotti, prodotti) {
    const vendite = [];

    //ciclo tutte le produzioni
    for(let entryProdotto of produzioneProdotti){
        for(let prodotto of entryProdotto.produzione){
            //la vendita e' registrata a fine mese
            let data = new Date(entryProdotto.data.getFullYear(), entryProdotto.data.getMonth()+1, 0);
            //data.setHours(0,0,0,0);
            data.setHours(23, 59, 59, 999);
            //Non consideriamo la possibile vendita del mese corrente, in quanto ancora non si e' realizzata
            if (data.getMonth() === new Date().getMonth() && data.getFullYear() === new Date().getFullYear())
                continue;
            
            //trovo di quale prodotto stiamo parlando
            let prodottoFinito = prodotti.find(prod => prod.id == prodotto.id);
            //calcolo il venduto, assumo che ne vendiamo un 80% al minimo
            let quantitaVenduta = faker.number.int({min: prodotto.quantita * 0.8, max: prodotto.quantita, multipleOf: 1});
            //calcolo il valore di vendita
            let valoreVendita = arrotonda2Decimali(prodottoFinito.valoreunitario * quantitaVenduta);
            //segno la quantita non venduta
            let invenduto = prodotto.quantita - quantitaVenduta;

            vendite.push({prodotto: prodottoFinito, quantita: quantitaVenduta, valoreVendita: valoreVendita, invenduto: invenduto, data: data});
        }
    }

    //Ordino le vendite per data
    vendite.sort((a, b) => a.data - b.data);

    //Assegno ad ogni vendita un id
    let id=0;
    for(let vendita of vendite){
        vendita.id = id;
        id++;
    }

    fs.writeFileSync('Dataset_Vendite.json', JSON.stringify(vendite, null, 2), 'utf8');
    console.log('Dataset_Vendite.json generato');

    return vendite;
}

//Funzione per calcolare le perdite sulle vendite
function generaPerdite(vendite) {
    const perdite = [];

    //Calcolo la perdita dei prodotti invenduti
    for (let vendita of vendite) {
        //Non consideriamo la possibile perdita del mese corrente, in quanto ancora non si e' realizzata
        if (vendita.data.getMonth() === new Date().getMonth() && vendita.data.getFullYear() === new Date().getFullYear())
            continue;

        //Se c'e' una quantita' invenduta, ne vendiamo al minimo il 75%
        if (vendita.invenduto > 0) {
            let quantitaVenduta = faker.number.int({ min: vendita.invenduto * 0.75, max: vendita.invenduto, multipleOf: 1 });
            vendita.quantita += quantitaVenduta;
            let invenduto = vendita.invenduto - quantitaVenduta;
            vendita.invenduto = invenduto;
            //Se c'e' ancora un invenduto, lo considero come perdita
            if (invenduto > 0) {
                let valorePerdita = arrotonda2Decimali(invenduto * vendita.prodotto.valoreunitario);
                perdite.push({ id: vendita.id, prodotto: vendita.prodotto, quantita: invenduto, valorePerdita: valorePerdita, data: vendita.data });
            }
        }
    }

    fs.writeFileSync('Dataset_Perdite.json', JSON.stringify(perdite, null, 2), 'utf8');
    console.log('Dataset_Perdite.json generato');

    //Aggiorno l'invenduto e le quantita' delle vendite
    aggiornaVendite(vendite);

    return perdite;
}

//Funzion per aggiornare le vendite
function aggiornaVendite(vendite) {
    fs.writeFileSync('Dataset_Vendite.json', JSON.stringify(vendite, null, 2), 'utf8');
    console.log('Dataset_Vendite.json aggiornato');

    return vendite;
}

//Funzione per generare i Terreni
function generaTerreni() {
    const terreniJson = [
        { id: 0, nome: 'Terreno Azzurro', ettari: 3 },
        { id: 1, nome: 'Terreno Verde', ettari: 5 },
        { id: 2, nome: 'Terreno Giallo', ettari: 1.25 },
    ];

    //Per ogni terreno stablisco dei livelli di azoto, fosforo, potassio, nitrogeno e acqua randomici tra il 35 e 100
    //e un fattore di decadimento giornaliero tra 0.01 e 0.03 con precisione a 3 decimali, questi serviranno per il calcolo della produzione e delle azioni correttive dei valori sul terreno
    const dataTerreni = terreniJson.map(item => ({
        id: item.id,
        nome: item.nome,
        ettari: item.ettari,
        azoto: [{ livello: faker.number.int({ min: 35, max: 100 }), decadimento: faker.number.float({ min: 0.01, max: 0.03, multipleOf: 0.001 }) }],
        fosforo: [{ livello: faker.number.int({ min: 35, max: 100 }), decadimento: faker.number.float({ min: 0.01, max: 0.03, multipleOf: 0.001 }) }],
        potassio: [{ livello: faker.number.int({ min: 35, max: 100 }), decadimento: faker.number.float({ min: 0.01, max: 0.03, multipleOf: 0.001 }) }],
        nitrogeno: [{ livello: faker.number.int({ min: 35, max: 100 }), decadimento: faker.number.float({ min: 0.01, max: 0.03, multipleOf: 0.001 }) }],
        acqua: [{ livello: faker.number.int({ min: 35, max: 100 }), decadimento: faker.number.float({ min: 0.01, max: 0.03, multipleOf: 0.001 }) }],
        colture: []
    }));

    //Assegno un numero fisso di colture  la loro tipologia
    dataTerreni.forEach(terreno => {
        //Terreno Azzurro
        if (terreno.id == 0)
            terreno.colture = [{ id: 15, quantita: 3000 }];

        //Terreno Verde
        if (terreno.id == 1)
            terreno.colture = [{ id: 16, quantita: 15000 }];

        //Terreno Giallo
        if (terreno.id == 2)
            terreno.colture = [{ id: 17, quantita: 20000 }, { id: 18, quantita: 15000 }, { id: 19, quantita: 6000 },];
    });

    fs.writeFileSync('Dataset_Terreni.json', JSON.stringify(dataTerreni, null, 2), 'utf8');
    console.log('Dataset_Terreni.json generato');

    return dataTerreni;
};

//Funzione per generare i dati di correzione del terreno, per simulare un cambiamento nel tempo dei valori nutrizionali e dell'acqua in base alle precipitazioni,
//dello scorrere del tempo e correzioni tramite concimi e fertilizzanti
function generaCorrezioniTerreno(terreni, datiprecipitazioni, magazzini, concimi, fertilizzanti) {
    const correzioniTerreno = [];

    //Per ogni terreno
    terreni.forEach((_terreno) => {
        let terrenoAggiornato = JSON.parse(JSON.stringify(_terreno));

        //Ciclo tutti gli anni usando dataInizio
        for (let anno = dataInizio.getFullYear(); anno <= dataFine.getFullYear(); anno++) {
            //Ciclo tutti i mesi
            for (let mese = 1; mese <= 12; mese++) {
                //Trovo se c'e' un dato di precipitazione per quell'anno e mese
                const precipitazione = datiprecipitazioni.find(p => p.data.getFullYear() == anno && p.data.getMonth() == mese);

                let correzione;
                //Se e' undefined, non ha trovato per quell'anno e mese alcuna precipitazione, stiamo considerando dei mesi agli estremi destro e sinistro del dataset non esistenti
                if (precipitazione != undefined) {
                    //Aggiorno i livelli nutrizionali, sottraendone il decadimento
                    terrenoAggiornato.azoto[0].livello = arrotonda2Decimali(terrenoAggiornato.azoto[0].livello - terrenoAggiornato.azoto[0].decadimento * new Date(anno, mese, 0).getDate());
                    terrenoAggiornato.fosforo[0].livello = arrotonda2Decimali(terrenoAggiornato.azoto[0].livello - terrenoAggiornato.fosforo[0].decadimento * new Date(anno, mese, 0).getDate());
                    terrenoAggiornato.potassio[0].livello = arrotonda2Decimali(terrenoAggiornato.azoto[0].livello - terrenoAggiornato.potassio[0].decadimento * new Date(anno, mese, 0).getDate());
                    terrenoAggiornato.nitrogeno[0].livello = arrotonda2Decimali(terrenoAggiornato.azoto[0].livello - terrenoAggiornato.nitrogeno[0].decadimento * new Date(anno, mese, 0).getDate());
                    terrenoAggiornato.acqua[0].livello = arrotonda2Decimali(terrenoAggiornato.azoto[0].livello - terrenoAggiornato.acqua[0].decadimento * new Date(anno, mese, 0).getDate());

                    //Se c'e' stato un volume di pioggia, lo reinserisco nel livello del terreno, non preciso in quanto dovrebbe essere una somma cumulativa...
                    if (precipitazione.lt_m2 > 0) {
                        terrenoAggiornato.acqua[0].livello = arrotonda2Decimali(terrenoAggiornato.acqua[0].livello + precipitazione.lt_m2);
                    }
                    
                    //Creo una correzione del terreno aggiornato alla data di precipitazione considerata utilizzando un deep copy, altrimenti aggiornerei tramite i puntatori dell'oggetto originale
                    correzione = { ...JSON.parse(JSON.stringify(terrenoAggiornato)), data: precipitazione.data };
                    correzioniTerreno.push(correzione);

                    //Creo un'azione di arricchimento per il mese considerato, utilizzando un deep copy per evitare problemi con i puntatori
                    let arricchimento =  { ...JSON.parse(JSON.stringify(correzione)), arricchimento: [] };
                    //Correzioni tramite concimi e fertilizzanti dai magazzini
                    //Se i livelli sono sotto il 50 effettuo una azione correttiva dei valori nutrizionali
                    if (arricchimento.azoto[0].livello <= 50 || arricchimento.fosforo[0].livello <= 50 || arricchimento.potassio[0].livello <= 50 || arricchimento.nitrogeno[0].livello <= 50) {
                        //Scelgo un magazzino a random
                        const indexMagazzinoRandom = Math.floor(Math.random() * magazzini.length);
                        //Preparo gli oggetti di concime o fertilizzate che andro' ad utilizzare
                        let objConcime;
                        let objFertilizzante;

                        //Se nel magazzino che ho scelto ho dei concimi allora scegliero' un concime a random
                        if (magazzini[indexMagazzinoRandom].concimi != undefined && magazzini[indexMagazzinoRandom].concimi.length > 0) {
                            const indexConcimeRandom = Math.floor(Math.random() * magazzini[indexMagazzinoRandom].concimi.length);
                            if (verificaEsistenzaId(magazzini[indexMagazzinoRandom].concimi[indexConcimeRandom], concimi) == true) {
                                objConcime = getObjectById(magazzini[indexMagazzinoRandom].concimi[indexConcimeRandom], concimi);
                            }
                        }

                        //Se nel magazzino che ho scelto ho dei fertilizzanti allora scegliero' un fertilizzante a random
                        if (magazzini[indexMagazzinoRandom].fertilizzanti != undefined && magazzini[indexMagazzinoRandom].fertilizzanti.length > 0) {
                            const indexFertilizzanteRandom = Math.floor(Math.random() * magazzini[indexMagazzinoRandom].fertilizzanti.length);
                            if (verificaEsistenzaId(magazzini[indexMagazzinoRandom].concimi[indexFertilizzanteRandom], fertilizzanti) == true) {
                                objFertilizzante = getObjectById(magazzini[indexMagazzinoRandom].fertilizzanti[indexFertilizzanteRandom], fertilizzanti);
                            }
                        }
                        //Se ho almeno un concime decido se utilizzarlo
                        if (objConcime != null || objConcime != undefined) {
                            let used = false;
                            //Se il concime ha un livello di azoto, incremento i livelli di azoto del terreno e setto la variabile di utilizzo a vero
                            if (objConcime.azoto != null) {
                                arricchimento.azoto[0].livello = arrotonda2Decimali(arricchimento.azoto[0].livello + objConcime.azoto);
                                used = true;
                            }
                            //Se il concime ha un livello di fosforo, incremento i livelli di fosforo del terreno e setto la variabile di utilizzo a vero
                            if (objConcime.fosforo != null) {
                                arricchimento.fosforo[0].livello = arrotonda2Decimali(arricchimento.azoto[0].livello + objConcime.fosforo);
                                used = true;
                            }
                            //Se il concime ha un livello di potassio, incremento i livelli di potassio del terreno e setto la variabile di utilizzo a vero
                            if (objConcime.potassio != null) {
                                arricchimento.potassio[0].livello = arrotonda2Decimali(arricchimento.azoto[0].livello + objConcime.potassio);
                                used = true;
                            }
                            //Se il concime ha un livello di nitrogeno, incremento i livelli di nitrogeno del terreno e setto la variabile di utilizzo a vero
                            if (objConcime.nitrogeno != null) {
                                arricchimento.nitrogeno[0].livello = arrotonda2Decimali(arricchimento.azoto[0].livello + objConcime.nitrogeno);
                                used = true;
                            }
                            //Se ho utilizzato un concime, inserisco nell'array l'azione correttiva dei valori nutrizionali del terreno
                            if (used == true) {
                                arricchimento.arricchimento.push(objConcime);
                            }
                        }

                        //Se ho almeno un fertilizzante decido se utilizzarlo
                        if (objFertilizzante != null || objFertilizzante != undefined) {
                            let used = false;
                            //Se il fertilizzante ha un livello di azoto, incremento i livelli di azoto del terreno e setto la variabile di utilizzo a vero
                            if (objFertilizzante.azoto != null) {
                                arricchimento.azoto[0].livello = arrotonda2Decimali(arricchimento.azoto[0].livello + objFertilizzante.azoto);
                                used = true;
                            }
                            //Se il fertilizzante ha un livello di fosforo, incremento i livelli di fosforo del terreno e setto la variabile di utilizzo a vero
                            if (objFertilizzante.fosforo != null) {
                                arricchimento.fosforo[0].livello = arrotonda2Decimali(arricchimento.azoto[0].livello + objFertilizzante.fosforo);
                                used = true;
                            }
                            //Se il fertilizzante ha un livello di potassio, incremento i livelli di potassio del terreno e setto la variabile di utilizzo a vero
                            if (objFertilizzante.potassio != null) {
                                arricchimento.potassio[0].livello = arrotonda2Decimali(arricchimento.azoto[0].livello + objFertilizzante.potassio);
                                used = true;
                            }
                            //Se il fertilizzante ha un livello di nitrogeno, incremento i livelli di nitrogeno del terreno e setto la variabile di utilizzo a vero
                            if (objFertilizzante.nitrogeno != null) {
                                arricchimento.nitrogeno[0].livello = arrotonda2Decimali(arricchimento.azoto[0].livello + objFertilizzante.nitrogeno);
                                used = true;
                            }
                            //Se ho utilizzato un fertilizzante, inserisco nell'array l'azione correttiva dei valori nutrizionali del terreno
                            if (used == true) {
                                arricchimento.arricchimento.push(objFertilizzante);
                            }
                        }
                    }

                    //aggiungo arrichimento al giorno successivo rispetto alla data considerata
                    let dataArricchimento = new Date(arricchimento.data);
                    dataArricchimento.setDate(dataArricchimento.getDate() + 1);
                    let correzioneArr = JSON.parse(JSON.stringify(arricchimento));
                    correzioneArr.data = dataArricchimento;
                    let correzioneArricchimento = { ...JSON.parse(JSON.stringify(correzioneArr)) };
                    correzioniTerreno.push(correzioneArricchimento);
                }
            }
        }
    });

    fs.writeFileSync('Dataset_CorrezioneTerreni.json', JSON.stringify(correzioniTerreno, null, 2), 'utf8');
    console.log('Dataset_CorrezioneTerreni.json generato');

    return correzioniTerreno;
};

//Funzione per generare la Strumentazione
//Costi degli strumenti variabili per simulare condizioni di mercato differenti
function generaStrumentazione() {
    const strumentazioneJson = [
        { id: 0, nome: 'RETE PER OLIVE A TELI LIGHT TESSUTO ANTISPINE CON APERTURA 6X6MT', costo: generaDatiVariabili(19, 1.5) },
        { id: 1, nome: 'CESTA PER OLIVE RETTANGOLARE FONDO FORATO', costo: generaDatiVariabili(15, 1.5) },
        { id: 2, nome: 'Forbici da potatura elettrica ricaricabile senza fili', costo: generaDatiVariabili(45, 2.5) },
        { id: 3, nome: 'Paterlini Ara 8/U Forbicione pneumatica 50cm', costo: generaDatiVariabili(300, 15) },
        { id: 4, nome: 'Forbici FELCO A024 06702', costo: generaDatiVariabili(130, 1) },
        { id: 5, nome: 'Sacchi Polipropilene 70x120 100 Kg Tessuto PZ10', costo: generaDatiVariabili(7, 1) },
        { id: 6, nome: 'Zappa bidente acciaio', costo: generaDatiVariabili(14, 2) },
        { id: 7, nome: 'Filtro a disco livellato da 120 mesh 130 micron', costo: generaDatiVariabili(18, 1.8) },
        { id: 8, nome: 'Regolatore di pressione acqua da 3/4 di pollice con manometro e filtro a rete', costo: generaDatiVariabili(35, 4.6) },
        { id: 9, nome: 'Valvola a sfera in ottone 3/4', costo: generaDatiVariabili(15, 3.7) },
        { id: 10, nome: 'Raccordo a gomito Ape M 3/4 x 20 mm ottone ARL3004200', costo: generaDatiVariabili(5, 1) },
        { id: 11, nome: '1BLISTER MANICOTTO DIAMETRO 16 4PZ', costo: generaDatiVariabili(28, 2.5) },
        { id: 12, nome: 'Scuoti olive elettrico 12V', costo: generaDatiVariabili(200, 15) },
        { id: 13, nome: 'GeoTech Pro LFM 85 - Trinciaerba per trattore', costo: generaDatiVariabili(1013, 75) },
        { id: 14, nome: 'Ala gocciolante IRRITEC TANDEM', costo: generaDatiVariabili(22, 2) },

    ];

    fs.writeFileSync('Dataset_Strumentazione.json', JSON.stringify(strumentazioneJson, null, 2), 'utf8');
    console.log('Dataset_Strumentazione.json generato');

    return strumentazioneJson;
};

//Funzione per generare le Sedi
function generaSedi(terreni, magazzini) {
    const sediJson = [
        { id: 0, nome: 'Sede Amministrativa', indirizzo: 'Via Roma, 87', citta: 'Perugia' },
        { id: 1, nome: 'Magazzino Principale', indirizzo: 'Via Mazzini 99 ', citta: 'Perugia', magazzini: [magazzini[0].id, magazzini[1].id, magazzini[2].id, magazzini[3].id] },
        { id: 2, nome: 'Terreno Azzurro', indirizzo: 'Via Cavour 12', citta: 'Perugia', magazzini: [magazzini[4].id], terreno: terreni[0].id },
        { id: 3, nome: 'Terreno Verde', indirizzo: 'Via Matteotti 3', citta: 'Perugia', magazzini: [magazzini[5].id], terreno: terreni[1].id },
        { id: 4, nome: 'Terreno Giallo', indirizzo: 'Via Dante Alighieri 47', citta: 'Perugia', magazzini: [magazzini[6].id], terreno: terreni[2].id },
    ];

    fs.writeFileSync('Dataset_Sedi.json', JSON.stringify(sediJson, null, 2), 'utf8');
    console.log('Dataset_Sedi.json generato');

    return sediJson;
};

//Funzione per generare gli Agrofarmaci
//Costi degli agrofarmaci variabili per simulare condizioni di mercato differenti
function generaAgrofarmaci() {
    const agrofarmaciJson = [
        { id: 0, nome: 'Manamid 100 sc', costo: generaDatiVariabili(42.75, 3) },
        { id: 1, nome: 'ORONDIS ULTRA VEG', costo: generaDatiVariabili(190.81, 7) },
        { id: 2, nome: 'Tiovit Jet Fungicida OIDIO Biologico zolfo', costo: generaDatiVariabili(3.85, 1) },
        { id: 3, nome: 'MATSUDA WG PLUS', costo: generaDatiVariabili(93.7, 4) },
        { id: 4, nome: 'Sivanto Prime', costo: generaDatiVariabili(88, 8) },
        { id: 5, nome: 'AIRONE LIQUIDO LT10', costo: generaDatiVariabili(9.8, 2) },
        { id: 6, nome: 'DECIS EVO LT5', costo: generaDatiVariabili(172.4, 12.5) },
        { id: 7, nome: 'Manamid 100 sc', costo: generaDatiVariabili(42.5, 5.2) },
    ];


    fs.writeFileSync('Dataset_Agrofarmaci.json', JSON.stringify(agrofarmaciJson, null, 2), 'utf8');
    console.log('Dataset_Agrofarmaci.json generato');

    return agrofarmaciJson;
};

//Funzione per generare gli Agrofarmaci
//Costi dei fertilizzanti variabili per simulare condizioni di mercato differenti
function generaFertilizzanti() {
    const fertilizzantiJson = [
        { id: 0, nome: 'Fertilizzante Yara Vera (Urea)', azoto: 46, costo: generaDatiVariabili(14, 2) },
        { id: 1, nome: 'Fertilizzante Nitrato di calcio idrosolubile 15,5 N + 26,5 CaO 25KG', azoto: 14.4, costo: generaDatiVariabili(18, 2) },
    ];

    fs.writeFileSync('Dataset_Fertilizzanti.json', JSON.stringify(fertilizzantiJson, null, 2), 'utf8');
    console.log('Dataset_Fertilizzanti.json generato');

    return fertilizzantiJson;
};

//Funzione per generare i Concimi
//Costi dei concimi variabili per simulare condizioni di mercato differenti
function generaConcimi() {
    const concimiJson = [
        { id: 0, nome: 'PLANTAFOL 20 20 20 Concime NPK macro e microelementi chelati con EDTA 5KG', azoto: 20, fosforo: 20, potassio: 20, costo: generaDatiVariabili(8, 0.5) },
        { id: 1, nome: 'Fylloton Biolchim Concime Biologico Alghe e Amminoacidi 5L', azoto: 6, costo: generaDatiVariabili(52, 6) },
        { id: 2, nome: 'Concime Biologico Leonardite Blackjak Bio Sipcam', azoto: 0.5, costo: generaDatiVariabili(18, 2) },
        { id: 3, nome: 'Humozon 10L Sumitomo Concime Biostimolante Biologico', azoto: 8.7, costo: generaDatiVariabili(31.2, 4) },
        { id: 4, nome: 'Greenleaf 20-20-20 Biolchim Concime Fogliare NPK + microelementi 2.5Kg', azoto: 20, fosforo: 20, potassio: 20, costo: generaDatiVariabili(18, 2) },
    ];


    fs.writeFileSync('Dataset_Concimi.json', JSON.stringify(concimiJson, null, 2), 'utf8');
    console.log('Dataset_Concimi.json generato');

    return concimiJson;
};

//Funzione per generare i Macchinari
//Costi dei macchinari variabili per simulare condizioni di mercato differenti
function generaMacchinari() {
    const macchinariJson = [
        { id: 0, nome: 'GeoTech Pro LFM 85 - Trinciaerba per trattore', costo: generaDatiVariabili(969, 15) },
        { id: 1, nome: 'Trattrice NEW HOLLAND T6', cv: 121, kw: 81, costo: generaDatiVariabili(32000, 1050) },
        { id: 2, nome: 'Trattrice ARION 410', cv: 125, kw: 92, costo: generaDatiVariabili(58750, 1000) },
        { id: 3, nome: 'Claas Dominator 130 Dominator 130 4X2 4.2M HEADER - PERKINS TIER 3', cv: 52, kw: 112, costo: generaDatiVariabili(99950, 1700) },
        { id: 4, nome: 'Erpice rotante CELLI 225', costo: generaDatiVariabili(7270, 700) },
        { id: 5, nome: 'Erpice a dischi ANGELONI FMP 24-610', costo: generaDatiVariabili(8100, 720) },
        { id: 6, nome: 'Trattrice MF 4709 PT', cv: 95, kw: 70, costo: generaDatiVariabili(49000, 1100) },
        { id: 7, nome: 'Spandiconcime AMAZONE ZAM 1001', costo: generaDatiVariabili(7500, 300) },
        { id: 8, nome: 'Seminatrice GASPARDO SP 530', costo: generaDatiVariabili(5000, 350) },
        { id: 9, nome: 'Estirpatore DELEKS DE-165/7', costo: generaDatiVariabili(770, 30) },
        { id: 10, nome: 'Zappatrice BERCI GIOVE 165', costo: generaDatiVariabili(1250, 120) },
        { id: 11, nome: 'Spandiconcime AMAZONE ZAM 1001', costo: generaDatiVariabili(7500, 140) },
        { id: 12, nome: 'GeoTech Pro LFM 85 - Trinciaerba per trattore', costo: generaDatiVariabili(2500, 110) },
    ];


    fs.writeFileSync('Dataset_Macchinari.json', JSON.stringify(macchinariJson, null, 2), 'utf8');
    console.log('Dataset_Macchinari.json generato');

    return macchinariJson;
};

//Funzione per ricalcolo saldi dei prodotti finiti in giacenza nei magazzini
//Sommo tutta la produzione, le vendite e le perdite per ottenere i saldi finali in magazzino
function ricalcolaSaldi(magazzini, produzione, vendite, perdite) {
    //Calcolo le perdite, uso l'id del prodotto come chiave
    let saldiPerdite = {};
    for(let entry of perdite){
        if(saldiPerdite[entry.prodotto.id]) {
            saldiPerdite[entry.prodotto.id] += entry.quantita;
        } else {
            saldiPerdite[entry.prodotto.id] = entry.quantita;
        }
    }

    //Calcolo la produzione, uso l'id del prodotto di produzione come chiave
    let saldiProdotti = {};
    for(let entry of produzione){
        for(let item of entry.produzione) {
            if(saldiProdotti[item.id]) {
                saldiProdotti[item.id] += item.quantita;
            } else {
                saldiProdotti[item.id] = item.quantita;
            }
        }
    }
    
    //Calcolo le vendite uso l'id del prodotto come chiave
    let saldiVendite = {};
    for(let entry of vendite){
        if(saldiVendite[entry.prodotto.id]) {
            saldiVendite[entry.prodotto.id] += entry.quantita;
        } else {
            saldiVendite[entry.prodotto.id] = entry.quantita;
        }
    }

    //Calcolo i saldi finali utilizzando come chiave gli id dei prodotti negli array calcolati
    let saldiFinali = [];
    for(let id in saldiProdotti) {
        let valoreFinale = saldiProdotti[id] - ((saldiVendite[id] || 0)  + (saldiPerdite[id] || 0));
        if(valoreFinale > 0)
            saldiFinali.push({ id: Number(id), quantita: valoreFinale });
    }
        
    //I prodotti finiti non venduti sono a saldo in magazzino MP_MAG3
    for(let magazzino of magazzini) {
        if(magazzino.nome == 'MP_MAG3') {
            magazzino.prodotti = saldiFinali;
        }
    }
    
    //Aggiorno il Dataset_Magazzini con i dati
    fs.writeFileSync('Dataset_Magazzini.json', JSON.stringify(magazzini, null, 2), 'utf8');
    console.log('Dataset_Magazzini.json aggiornato');
};

//Funzione per calcolare i costi del personale e delle perdite dei prodotti per invenduto
function generaCosti(utenti, perdite){
    const costi = [];

    let id = 0;
    let currentDate = new Date(dataInizio);
    //imposto la data di partenza come il primo giorno del mese alle 00:00:00 per andare a calcolare la validita' dei contratti del personale
    currentDate.setDate(1);
    currentDate.setHours(0, 0, 0, 0);
    for (currentDate; currentDate <= dataFine; currentDate.setMonth(currentDate.getMonth() + 1)) {
        //calcolo il costo del personale
        let costoPersonale = 0;
        let lastDayCurrentDate = new Date(currentDate);
        //Imposto l'ultimo giorno del mese corrente e setto l'orario alle 23:59:59:999 per ottenere la validita' del contratto
        lastDayCurrentDate.setMonth(currentDate.getMonth() + 1);
        lastDayCurrentDate.setDate(0);
        lastDayCurrentDate.setHours(23, 59, 59, 999);

        for(let utente of utenti) {
            //dipendenti a tempo indeterminato li calcolo ogni mese
            if(utente.datainiziocontratto === undefined && utente.datafinecontratto === undefined)
            {
                costoPersonale += utente.costomensile;
            }
            
            let dataInizioContratto = new Date(utente.datainiziocontratto);
            dataInizioContratto.setHours(0, 0, 0, 0);

            let dataFineContratto = new Date(utente.datafinecontratto);
            dataFineContratto.setHours(23, 59, 59, 999);
            
            //Se la data di inzio contratto e la data di fine contratto sono nel range che sto considerando, ne sommo i costi del personale
            if(dataInizioContratto <= currentDate && dataFineContratto >= lastDayCurrentDate ) {
                costoPersonale += utente.costomensile;
            }
        }

        let costoPerdita = 0;
        //calcolo il costo delle perdite
        for(let perdita of perdite) {
            let dataPerdita = new Date(perdita.data);
            //Normalizzo la data in perdita per sfruttare la struttura di date precedentemente impostata ed ottenere i costi in un unico record con la stessa data
            dataPerdita.setHours(0, 0, 0, 0);
            if(dataPerdita >= currentDate && dataPerdita <= lastDayCurrentDate) {
                costoPerdita += perdita.valorePerdita;
            }
        }

        //Inserisco i costi, al momento li separo per futuro utilizzo
        costi.push(
            {
                id: id,
                data: new Date(lastDayCurrentDate),
                costopersonale: arrotonda2Decimali(costoPersonale),
                costoperdita: arrotonda2Decimali(costoPerdita)
            }
        );
        id++;
    }

    fs.writeFileSync('Dataset_Costi.json', JSON.stringify(costi, null, 2), 'utf8');
    console.log('Dataset_Costi.json generato');

    return costi;
};

//Funzione per generare tutto il DataSet
function generaDataSet() {
    //Genera Precipitazioni
    var precipitazioni = generaPrecipitazioni();

    //Genera Macchinari
    var macchinari = generaMacchinari();

    //Genera Prodotti
    var prodotti = generaProdotti();

    //Genera Fertilizzanti
    var fertilizzanti = generaFertilizzanti();

    //Genera Agrofarmaci
    var agrofarmaci = generaAgrofarmaci();

    //Genera Concimi
    var concimi = generaConcimi();

    //Genera Strumentazione
    var strumenti = generaStrumentazione();

    //Genera Terreni
    var terreni = generaTerreni();

    //Genera Magazzini
    var magazzini = generaMagazzini();

    //Genera Sedi
    generaSedi(terreni, magazzini);

    //Genera Decadimento Terreno
    var correzioniTerreno = generaCorrezioniTerreno(terreni, precipitazioni, magazzini, concimi, fertilizzanti);

    //Genera Produzione
    var produzione = generaProduzione(correzioniTerreno);

    //Genera Vendite
    var vendite = generaVendite(produzione, prodotti);

    //Genera Perdite
    var perdite = generaPerdite(vendite);
    
    //Ricalcola Saldi Prodotti Finiti
    var saldi = ricalcolaSaldi(magazzini, produzione, vendite, perdite);

    //Genera Utenti
    var utenti = generaUtenti();

    //Genera Costi
    var costi = generaCosti(utenti, perdite);
};