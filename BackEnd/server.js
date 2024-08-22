const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { generaDataSet } = require('./generatore_dati.js');
const app = express();
const port = 3001;

//Middleware per loggare le richieste in ingresso ed uscita
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} richiesta a ${req.url} da IP: ${req.ip}`);
    next();
};

//Abilita i CORS
app.use(cors());
app.use(express.json());
//Attva il middleware
app.use(requestLogger);

//Chiamata POST di test, non utilizzata, ma inserita per completezza dimostrtiva
app.post('/api/data', (req, res) => {
    //Prendo l'oggetto ricevuto nel body
    const newData = req.body;
    fs.readFile('test.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati test');
        } else {
            const jsonData = JSON.parse(data);
            jsonData.push(newData);
            fs.writeFile('test.json', JSON.stringify(jsonData, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Errore nella scrittura dei dati');
                } else {
                    res.status(200).send('Dati test salvati con successo');
                }
            });
        }
    });
});

//Interroga i dati delle precipitazioni
//Es chiamata http://localhost:3001/api/data/precipitazioni?startDate=2019-08-04&endDate=2024-08-04&nome=Tempesta&lt_m2=50&temperatura=37
app.get('/api/data/precipitazioni', (req, res) => {
    //Leggo le date di inizio e fine, se passate, altrimenti sono null
    const startDate = req.query.startDate ? new Date(req.query.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate).setHours(0, 0, 0, 0) : null;

    //Il datarange deve essere specificato se almeno uno dei due è impostato
    if ((!startDate && endDate) || (startDate && !endDate)) {
        res.status(400).send('Mancano startDate o endDate');
        return;
    }
    
    //Leggo il dataset
    fs.readFile('Dataset_Precipitazioni.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Precipitazioni.json');
        } 
        else {
            //Prendo tutto il dataset delle precipitazioni
            const precipitazioni = JSON.parse(data);
            //Preparo il filtro
            let filteredPrecipitazioni = precipitazioni;
            //Se sto filtrando per id, cerco nelle precipitazioni quell'id
            if (req.query.id) {
                filteredPrecipitazioni = filteredPrecipitazioni.filter((precipitazione) => precipitazione.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nelle precipitazioni quello che contiene quel nome (case insensitive)
            if (req.query.nome) {
                filteredPrecipitazioni = filteredPrecipitazioni.filter((precipitazione) => precipitazione.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per litri a metro cubo, cerco nelle precipitazioni quelli che hanno un valore maggiore o uguale a quello indicato
            if (req.query.lt_m2) {
                filteredPrecipitazioni = filteredPrecipitazioni.filter((precipitazione) => precipitazione.lt_m2 >= req.query.lt_m2);
            }
            //Se sto filtrando per temperatura, cerco nelle precipitazioni quelli che hanno un valore maggiore o uguale a quello indicato
            if (req.query.temperatura) {
                filteredPrecipitazioni = filteredPrecipitazioni.filter((precipitazione) => precipitazione.temperatura >= req.query.temperatura);
            }
            //Se sto filtrando per data, cerco nelle precipitazioni quelli che hanno una data compresa tra startDate e endDate
            //Altrimenti ritorno i dati filtrati cosi come sono
            if (!startDate && !endDate) {
                res.json(filteredPrecipitazioni);
            } 
            else {
                filteredPrecipitazioni = filteredPrecipitazioni.filter((precipitazione) => {
                    //Normalizzo la data che sto considerando
                    const currentDate = new Date(precipitazione.data).setHours(0, 0, 0, 0);
                    return currentDate >= startDate && currentDate <= endDate;
                });

                //resituisco i dati filtrati per la data
                res.json(filteredPrecipitazioni);
            }
        }
    });
});

//Interroga i dati degli utenti
//Es chiamata http://localhost:3001/api/data/utenti?id=0&username=rossi&cognome=rossi&nome=alessandro&tipocontratto=indeterminato&ruolo=Admin&sede=0&costomensile=4500&datainiziocontratto=2019-08-01&datafinecontratto=2019-08-31
app.get('/api/data/utenti', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Utenti.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Utenti');
        } 
        else {
            //Prendo tutto il dataset degli utenti
            const utenti = JSON.parse(data);
            //Preparo il filtro
            let filteredUtenti = utenti;

            //Se sto filtrando per id, cerco negli utenti quell'id
            if (req.query.id) {
                filteredUtenti = filteredUtenti.filter((utente) => utente.id == req.query.id);
            }
            //Se sto filtrando per username, cerco nel dataset quelli che hanno quel username (case insensitive)
            if (req.query.username) {
                filteredUtenti = filteredUtenti.filter((utente) => utente.username.toLowerCase().includes(req.query.username.toLowerCase()));
            }
            //Se sto filtrando per nome, cerco nel dataset quelli che hanno quel nome (case insensitive)
            if (req.query.nome) {
                filteredUtenti = filteredUtenti.filter((utente) => utente.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per cognome, cerco nel dataset quelli che hanno quel cognome (case insensitive)
            if (req.query.cognome) {
                filteredUtenti = filteredUtenti.filter((utente) => utente.cognome.toLowerCase().includes(req.query.cognome.toLowerCase()));
            }
            //Se sto filtrando per tipocontratto, cerco nel dataset quelli che hanno quel tipocontratto (case insensitive)
            if (req.query.tipocontratto) {
                filteredUtenti = filteredUtenti.filter((utente) => utente.tipocontratto.toLowerCase().includes(req.query.tipocontratto.toLowerCase()));
            }
            //Se sto filtrando per ruolo, cerco nel dataset quelli che hanno quel ruolo (case insensitive)
            if (req.query.ruolo) {
                filteredUtenti = filteredUtenti.filter((utente) => utente.ruolo.toLowerCase().includes(req.query.ruolo.toLowerCase()));
            }
            //Se sto filtrando per sede, cerco nel dataset quelli che hanno quella sede
            if (req.query.sede) {
                filteredUtenti = filteredUtenti.filter((utente) => utente.sede == req.query.sede);
            }
            //Se sto filtrando per costomensile, cerco nel dataset quelli che hanno un valore maggiore o uguale a quello indicato
            if (req.query.costomensile) {
                filteredUtenti = filteredUtenti.filter((utente) => utente.costomensile >= req.query.costomensile);
            }
            //Se sto filtrando per datainiziocontratto, cerco nel dataset quelli che hanno una data di inizio contratto successiva o uguale a quella indicata
            if (req.query.datainiziocontratto) {
                filteredUtenti = filteredUtenti.filter((utente) => {
                    const currentDate = new Date(utente.datainiziocontratto).setHours(0, 0, 0, 0);
                    const reqDate = new Date(req.query.datainiziocontratto).setHours(0, 0, 0, 0);
                    return currentDate >= reqDate;
                });
            }
            //Se sto filtrando per datafinecontratto, cerco nel dataset quelli che hanno una data di inizio contratto successiva o uguale a quella indicata
            if (req.query.datafinecontratto) {
                filteredUtenti = filteredUtenti.filter((utente) => {
                    const currentDate = new Date(utente.datafinecontratto).setHours(0, 0, 0, 0);
                    const reqDate = new Date(req.query.datafinecontratto).setHours(0, 0, 0, 0);
                    return currentDate <= reqDate;
                });
            }

            //Restituisco i dati filtrati
            res.json(filteredUtenti);
        }
    });
});

//Interroga i dati degli agrofarmaci
//Es chiamata http://localhost:3001/api/data/agrofarmaci?id=0&nome=manamid&costo=160
app.get('/api/data/agrofarmaci', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Agrofarmaci.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Agrofarmaci');
        } 
        else {
             //Prendo tutto il dataset degli agrofarmaci
            const agrofarmaci = JSON.parse(data);
            //Preparo il filtro
            let filteredAgrofarmaci = agrofarmaci;
            //Se sto filtrando per id, cerco negli agrofarmaci quelli che hanno lo stesso id
            if (req.query.id) {
                filteredAgrofarmaci = filteredAgrofarmaci.filter((agrofarmaco) => agrofarmaco.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nel dataset quelli che hanno quel nome (case insensitive)
            if (req.query.nome) {
                filteredAgrofarmaci = filteredAgrofarmaci.filter((agrofarmaco) => agrofarmaco.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per costo, cerco nel dataset quelli che hanno quel costo o superiore a quello indicato
            if (req.query.costo) {
                filteredAgrofarmaci = filteredAgrofarmaci.filter((agrofarmaco) => agrofarmaco.costo >= req.query.costo);
            }
            //Restituisco i dati filtrati
            res.json(filteredAgrofarmaci);
        }
    });
});

//Interroga i dati dei concimi
//Es chiamata http://localhost:3001/api/data/concimi?id=4&nome=greenleaf&costo=10&azoto=10&fosforo=10&potassio=10
app.get('/api/data/concimi', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Concimi.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Concimi');
        } 
        else {
             //Prendo tutto il dataset dei concimi
            const concimi = JSON.parse(data);
            //Preparo il filtro
            let filteredConcimi = concimi;
            //Se sto filtrando per id, cerco nei concimi quell'id
            if (req.query.id) {
                filteredConcimi = filteredConcimi.filter((concime) => concime.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nei concimi quelli che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredConcimi = filteredConcimi.filter((concime) => concime.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per costo, cerco nei concimi quelli con costo o superiore a quello indicato
            if (req.query.costo) {
                filteredConcimi = filteredConcimi.filter((concime) => concime.costo >= req.query.costo);
            }
            //Se sto filtrando per azoto, cerco nei concimi quelli con azoto o superiore a quello indicato
            if (req.query.azoto) {
                filteredConcimi = filteredConcimi.filter((concime) => concime.azoto >= req.query.azoto);
            }
            //Se sto filtrando per fosforo, cerco nei concimi quelli con fosforo o superiore a quello indicato
            if (req.query.fosforo) {
                filteredConcimi = filteredConcimi.filter((concime) => concime.fosforo >= req.query.fosforo);
            }
            //Se sto filtrando per potassio, cerco nei concimi quelli con potassio o superiore a quello indicato
            if (req.query.potassio) {
                filteredConcimi = filteredConcimi.filter((concime) => concime.potassio >= req.query.potassio);
            }

            //Restituisco i dati filtrati
            res.json(filteredConcimi);
        }
    });
});

//Interroga i dati dei fertilizzanti
//Es chiamata http://localhost:3001/api/data/fertilizzanti?id=0&nome=yara&costo=10&azoto=10
app.get('/api/data/fertilizzanti', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Fertilizzanti.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Fertilizzanti');
        } 
        else {
            //Prendo tutto il dataset dei fertilizzanti
            const fertilizzanti = JSON.parse(data);
            //Preparo il filtro
            let filteredFertilizzanti = fertilizzanti;
            //Se sto filtrando per id, cerco nei fertilizzanti quelli con id uguale a quello indicato
            if (req.query.id) {
                filteredFertilizzanti = filteredFertilizzanti.filter((fertilizzante) => fertilizzante.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nei fertilizzanti quelli che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredFertilizzanti = filteredFertilizzanti.filter((fertilizzante) => fertilizzante.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per costo, cerco nei fertilizzanti quelli con costo uguale o superiore a quello indicato
            if (req.query.costo) {
                filteredFertilizzanti = filteredFertilizzanti.filter((fertilizzante) => fertilizzante.costo >= req.query.costo);
            }
            //Se sto filtrando per azoto, cerco nei fertilizzanti quelli con azoto uguale o superiore a quello indicato
            if (req.query.azoto) {
                filteredFertilizzanti = filteredFertilizzanti.filter((fertilizzante) => fertilizzante.azoto >= req.query.azoto);
            }

            //Restituisco i dati filtrati
            res.json(filteredFertilizzanti);
        }
    });
});

//Interroga i dati dei macchinari
//Es chiamata http://localhost:3001/api/data/macchinari?id=3&nome=claas&costo=98000&cv=52&kw=112
app.get('/api/data/macchinari', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Macchinari.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Macchinari');
        } 
        else {
            //Prendo tutto il dataset dei macchinari
            const macchinari = JSON.parse(data);
            //Preparo il filtro
            let filteredMacchinari = macchinari;
            //Se sto filtrando per id, cerco nei macchinari quelli con id uguale a quello indicato
            if (req.query.id) {
                filteredMacchinari = filteredMacchinari.filter((macchinario) => macchinario.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nei macchinari quelli che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredMacchinari = filteredMacchinari.filter((macchinario) => macchinario.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per costo, cerco nei macchinari quelli con costo uguale o superiore a quello indicato
            if (req.query.costo) {
                filteredMacchinari = filteredMacchinari.filter((macchinario) => macchinario.costo >= req.query.costo);
            }
            //Se sto filtrando per cv, cerco nei macchinari quelli con cv uguale o superiore a quello indicato
            if (req.query.cv) {
                filteredMacchinari = filteredMacchinari.filter((macchinario) => macchinario.cv >= req.query.cv);
            }
            //Se sto filtrando per kw, cerco nei macchinari quelli con kw uguale o superiore a quello indicato
            if (req.query.kw) {
                filteredMacchinari = filteredMacchinari.filter((macchinario) => macchinario.kw >= req.query.kw);
            }
            
            //Restituisco i dati filtrati
            res.json(filteredMacchinari);
        }
    });
});

//Interroga i dati dei prodotti
//Es chiamata http://localhost:3001/api/data/prodotti?id=0&nome=lattuga&unitamisura=PZ&pesokg=0.7&qualita=bassa&valoreunitario=3
app.get('/api/data/prodotti', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Prodotti.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Prodotti');
        } 
        else {
            //Prendo tutto il dataset dei prodotti
            const prodotti = JSON.parse(data);
            //Preparo il filtro
            let filteredProdotti = prodotti;
            //Se sto filtrando per id, cerco nei prodotti quelli con id uguale a quello indicato
            if (req.query.id) {
                filteredProdotti = filteredProdotti.filter((prodotto) => prodotto.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nei prodotti quelli che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredProdotti = filteredProdotti.filter((prodotto) => prodotto.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per unitamisura, cerco nei prodotti quelli che hanno quella unitamisura o contenente quella indicata (case insensitive)
            if (req.query.unitamisura) {
                filteredProdotti = filteredProdotti.filter((prodotto) => prodotto.unitamisura.toLowerCase().includes(req.query.unitamisura.toLowerCase()));
            }
            //Se sto filtrando per pesokg, cerco nei prodotti quelli con pesokg uguale o superiore a quello indicato
            if (req.query.pesokg) {
                filteredProdotti = filteredProdotti.filter((prodotto) => prodotto.pesokg >= req.query.pesokg);
            }
            //Se sto filtrando per qualita, cerco nei prodotti quelli che hanno quella qualita o contenente quella indicata (case insensitive)
            if (req.query.qualita) {
                filteredProdotti = filteredProdotti.filter((prodotto) => prodotto.qualita.toLowerCase().includes(req.query.qualita.toLowerCase()));
            }
            //Se sto filtrando per valoreunitario, cerco nei prodotti quelli con valoreunitario uguale o superiore a quello indicato
            if (req.query.valoreunitario) {
                filteredProdotti = filteredProdotti.filter((prodotto) => prodotto.valoreunitario >= req.query.valoreunitario);
            }

            //Restituisco i dati filtrati
            res.json(filteredProdotti);
        }
    });
});

//Interroga i dati delle sedi
//Es chiamata http://localhost:3001/api/data/sedi?id=4&nome=Terreno&indirizzo=dante&citta=perugia&terreno=2&magazzini=6
app.get('/api/data/sedi', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Sedi.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Sedi');
        } 
        else {
            //Prendo tutto il dataset delle sedi
            const sedi = JSON.parse(data);
            //Preparo il filtro
            let filteredSedi = sedi;
            //Se sto filtrando per id, cerco nelle sedi quelli con id uguale a quello indicato
            if (req.query.id) {
                filteredSedi = filteredSedi.filter((sede) => sede.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nelle sedi quelli che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredSedi = filteredSedi.filter((sede) => sede.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per indirizzo, cerco nelle sedi quelli con indirizzo contenente la stringa indicata (case insensitive)
            if (req.query.indirizzo) {
                filteredSedi = filteredSedi.filter((sede) => sede.indirizzo.toLowerCase().includes(req.query.indirizzo.toLowerCase()));
            }
            //Se sto filtrando per citta, cerco nelle sedi quelli con citta contenente la stringa indicata (case insensitive)
            if (req.query.citta) {
                filteredSedi = filteredSedi.filter((sede) => sede.citta.toLowerCase().includes(req.query.citta.toLowerCase()));
            }
            //Se sto filtrando per terreno, cerco nelle sedi quelli con terreno uguale a quello indicato
            if (req.query.terreno) {
                filteredSedi = filteredSedi.filter((sede) => sede.terreno == req.query.terreno);
            }
            //Se sto filtrando per magazzini, cerco nelle sedi quelli con magazzini uguale a quello indicato
            if (req.query.magazzini) {
                filteredSedi = filteredSedi.filter((sede) => {
                    //Se magazzini non e' undefined e' un oggetto (lunghezza 1) resituisco la sede con quel magazzino
                    if (sede.magazzini != undefined) {
                        if (sede.magazzini.length == 1) {
                            return sede.magazzini[0] == parseInt(req.query.magazzini);
                        }
                        //Altrimenti e' un array e quindi cerco quale magazzino contiene quello indicato
                        else {
                            return sede.magazzini.includes(parseInt(req.query.magazzini))
                        }
                    }
                });
            }

            //Restituisco i dati filtrati
            res.json(filteredSedi);
        }
    });
});

//Interroga i dati degli strumenti
//Es chiamata http://localhost:3001/api/data/strumentazione?id=0&nome=rete&costo=17
app.get('/api/data/strumentazione', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Strumentazione.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Strumentazione');
        } 
        else {
            //Prendo tutto il dataset degli strumenti
            const strumenti = JSON.parse(data);
            //Preparo il filtro
            let filteredStrumentazione = strumenti;
            //Se sto filtrando per id, cerco negli strumenti quelli con id uguale a quello indicato
            if (req.query.id) {
                filteredStrumentazione = filteredStrumentazione.filter((strumento) => strumento.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco negli strumenti quelli che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredStrumentazione = filteredStrumentazione.filter((strumento) => strumento.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per costo, cerco negli strumenti quelli con costo uguale o superiore a quello indicato
            if (req.query.costo) {
                filteredStrumentazione = filteredStrumentazione.filter((strumento) => strumento.costo >= req.query.costo);
            }
            
            //Restituisco i dati filtrati
            res.json(filteredStrumentazione);
        }
    });
});

//Interroga i dati dei terreni
//Es chiamata http://localhost:3001/api/data/terreni?id=0&nome=Azzu&livelloazoto=56&decadimetoazoto=0.021&livellofosforo=91&decadimentofosforo=0.012&livellopotassio=86&decadimentopotassio=0.012&livellonitrogeno=90&decadimentonitrogeno=0.015&livelloacqua=61&decadimentoacqua=0.025&coltura=19&colturaquantita=1
app.get('/api/data/terreni', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Terreni.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Terreni');
        } 
        else {
            //Prendo tutto il dataset dei terreni
            const terreni = JSON.parse(data);
            //Preparo il filtro
            let filteredTerreni = terreni;
            //Se sto filtrando per id, cerco nei terreni quelli con id uguale a quello indicato
            if (req.query.id) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nei terreni quelli che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per ettari, cerco nei terreni quelli con un numero di ettari uguale o superiore a quello indicato
            if (req.query.ettari) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.ettari >= req.query.ettari);
            }
            //Se sto filtrando per livelloazoto, cerco nei terreni quelli con un livello di azoto uguale o superiore a quello indicato
            if (req.query.livelloazoto) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.azoto[0].livello >= req.query.livelloazoto);
            }
            //Se sto filtrando per decadimentoazoto, cerco nei terreni quelli con un decadimento di azoto uguale o superiore a quello indicato
            if (req.query.decadimetoazoto) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.azoto[0].decadimento >= req.query.decadimetoazoto);
            }
            //Se sto filtrando per livellofosforo, cerco nei terreni quelli con un livello di fosforo uguale o superiore a quello indicato
            if (req.query.livellofosforo) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.fosforo[0].livello >= req.query.livellofosforo);
            }
            //Se sto filtrando per decadimentofosforo, cerco nei terreni quelli con un decadimento di fosforo uguale o superiore a quello indicato
            if (req.query.decadimetofosforo) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.fosforo[0].decadimento >= req.query.decadimetofosforo);
            }
            //Se sto filtrando per livellopotassio, cerco nei terreni quelli con un livello di potassio uguale o superiore a quello indicato
            if (req.query.livellopotassio) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.potassio[0].livello >= req.query.livellopotassio);
            }
            //Se sto filtrando per decadimentopotassio, cerco nei terreni quelli con un decadimento di potassio uguale o superiore a quello indicato
            if (req.query.decadimetopotassio) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.potassio[0].decadimento >= req.query.decadimetopotassio);
            }
            //Se sto filtrando per livellonitrogeno, cerco nei terreni quelli con un livello di nitrogeno uguale o superiore a quello indicato
            if (req.query.livellonitrogeno) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.nitrogeno[0].livello >= req.query.livellonitrogeno);
            }
            //Se sto filtrando per decadimentonitrogeno, cerco nei terreni quelli con un decadimento di nitrogeno uguale o superiore a quello indicato
            if (req.query.decadimetonitrogeno) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.nitrogeno[0].decadimento >= req.query.decadimetonitrogeno);
            }
            //Se sto filtrando per livelloacqua, cerco nei terreni quelli con un livello di acqua uguale o superiore a quello indicato
            if (req.query.livelloacqua) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.acqua[0].livello >= req.query.livelloacqua);
            }
            //Se sto filtrando per decadimentoacqua, cerco nei terreni quelli con un decadimento di acqua uguale o superiore a quello indicato
            if (req.query.decadimetoacqua) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.acqua[0].decadimento >= req.query.decadimetoacqua);
            }
            //Se sto filtrando per coltura, cerco nei terreni quelli in cui è presente la coltura indicata
            if (req.query.coltura) {
                filteredTerreni = filteredTerreni.filter((terreno) => {
                    return terreno.colture.some(coltura => coltura.id == req.query.coltura);
                });
            }
            //Se sto filtrando per quantitacoltura, cerco nei terreni quelli in cui la coltura indicata ha una quantità uguale o superiore a quella indicata
            if (req.query.colturaquantita) {
                filteredTerreni = filteredTerreni.filter((terreno) => terreno.colture[0].quantita >= req.query.colturaquantita);
            }

            //Restituisco i dati filtrati
            res.json(filteredTerreni);
        }
    });
});

//Interroga i dati dei magazzini
//Es chiamata http://localhost:3001/api/data/magazzini?id=0&nome=MP_MAG&idmacchinario=0&idconcime=0&idfertilizzante=0&idstrumento=0&idprodotto=21
app.get('/api/data/magazzini', (req, res) => {
    //Leggo il dataset
    fs.readFile('Dataset_Magazzini.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Magazzini');
        } 
        else {
            //Prendo tutto il dataset dei magazzini
            const magazzini = JSON.parse(data);
            //Preparo il filtro
            let filteredMagazzini = magazzini;
            //Se sto filtrando per id, cerco nei magazzini quelli con l'id indicato
            if (req.query.id) {
                filteredMagazzini = filteredMagazzini.filter((magazzino) => magazzino.id == req.query.id);
            }
            //Se sto filtrando per nome, cerco nei magazzini quelli che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredMagazzini = filteredMagazzini.filter((magazzino) => magazzino.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se sto filtrando per idmacchinario, cerco nei magazzini quelli che hanno quel idmacchinario
            if (req.query.idmacchinario) {
                filteredMagazzini = filteredMagazzini.filter((magazzino) => {
                    return magazzino.macchinari.some(macchinario => macchinario.id == req.query.idmacchinario);
                });
            }
            //Se sto filtrando per idconcime, cerco nei magazzini quelli che hanno quel idconcime
            if (req.query.idconcime) {
                filteredMagazzini = filteredMagazzini.filter((magazzino) => {
                    return magazzino.concimi.some(concimi => concimi.id == req.query.idconcime);
                });
            }
            //Se sto filtrando per idfertilizzante, cerco nei magazzini quelli che hanno quel idfertilizzante
            if (req.query.idfertilizzante) {
                filteredMagazzini = filteredMagazzini.filter((magazzino) => {
                    return magazzino.fertilizzanti.some(fertilizzante => fertilizzante.id == req.query.idfertilizzante);
                });
            }
            //Se sto filtrando per idagrofarmaco, cerco nei magazzini quelli che hanno quel idagrofarmaco
            if (req.query.idagrofarmaco) {
                filteredMagazzini = filteredMagazzini.filter((magazzino) => {
                    return magazzino.agrofarmaci.some(agrofarmaco => agrofarmaco.id == req.query.idagrofarmaco);
                });
            }
            //Se sto filtrando per idstrumento, cerco nei magazzini quelli che hanno quel idstrumento
            if (req.query.idstrumento) {
                filteredMagazzini = filteredMagazzini.filter((magazzino) => {
                    return magazzino.strumenti.some(strumento => strumento.id == req.query.idstrumento);
                });
            }
            //Se sto filtrando per idprodotto, cerco nei magazzini quelli che hanno quel idprodotto
            if (req.query.idprodotto) {
                filteredMagazzini = filteredMagazzini.filter((magazzino) => {
                    return magazzino.prodotti.some(prodotto => prodotto.id == req.query.idprodotto);
                });
            }

            //Restituisco i dati filtrati
            res.json(filteredMagazzini);
        }
    });
});

//Interroga i dati delle correzioni terreno
//Es chiamata http://localhost:3001/api/data/correzioni?idterreno=0&nome=verde&startDate=2020-12-01&endDate=2024-01-01&soloarricchimento=true
app.get('/api/data/correzioni', (req, res) => {
    //Leggo le date di inizio e fine, se passate, altrimenti sono null
    const startDate = req.query.startDate ? new Date(req.query.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate).setHours(0, 0, 0, 0) : null;

    //Il datarange deve essere specificato se almeno uno dei due è impostato
    if ((!startDate && endDate) || (startDate && !endDate)) {
        res.status(400).send('Mancano startDate o endDate');
        return;
    }

    //Leggo il dataset
    fs.readFile('Dataset_CorrezioneTerreni.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Correzione');
        } 
        else {
            //Prendo tutto il dataset delle correzioni
            const correzioni = JSON.parse(data);
            //Preparo il filtro
            let filteredCorrezioni = correzioni;
            //Se sto filtrando per id, cerco nelle correzioni terreno quelle con l'id indicato
            if (req.query.idterreno) {
                filteredCorrezioni = filteredCorrezioni.filter((correzione) => correzione.id == req.query.idterreno);
            }
            //Se sto filtrando per nome, cerco nelle correzioni terreno quelle che hanno quel nome o contenente quello indicato (case insensitive)
            if (req.query.nome) {
                filteredCorrezioni = filteredCorrezioni.filter((correzione) => correzione.nome.toLowerCase().includes(req.query.nome.toLowerCase()));
            }
            //Se soloarricchimento e' true, escludo tutte le correzioni che non hanno un arricchimento e che non contengono azioni di arricchimento
            if (req.query.soloarricchimento == 'true') {
                filteredCorrezioni = filteredCorrezioni.filter((correzione) => correzione.arricchimento && correzione.arricchimento.length > 0 );
            }

            //Se sto filtrando per data, cerco nelle correzioni terreno quelli che hanno una data compresa tra startDate e endDate
            //Altrimenti ritorno i dati filtrati cosi come sono
            if (!startDate && !endDate) {
                res.json(filteredCorrezioni);
            } 
            else {
                filteredCorrezioni = filteredCorrezioni.filter((correzione) => {
                    //Normalizzo la data che sto considerando
                    const currentDate = new Date(correzione.data).setHours(0, 0, 0, 0);
                    return currentDate >= startDate && currentDate <= endDate;
                });

                //resituisco i dati filtrati per la data
                res.json(filteredCorrezioni);
            }
        }
    });
});

//Interroga i dati della produzione
//Es chiamata http://localhost:3001/api/data/produzione?id=9&idproduzione=9&startDate=2023-11-14&endDate=2023-11-15
app.get('/api/data/produzione', (req, res) => {
    //Leggo le date di inizio e fine, se passate, altrimenti sono null
    const startDate = req.query.startDate ? new Date(req.query.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate).setHours(0, 0, 0, 0) : null;

    //Il datarange deve essere specificato se almeno uno dei due è impostato
    if ((!startDate && endDate) || (startDate && !endDate)) {
        res.status(400).send('Mancano startDate o endDate');
        return;
    }

    //Leggo il dataset
    fs.readFile('Dataset_ProduzioneProdotti.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Produzione');
        } 
        else {
            //Prendo tutto il dataset delle produzioni
            const produzioni = JSON.parse(data);
            //Preparo il filtro
            let filteredProduzioni = produzioni;
            //Se sto filtrando per id, cerco nelle produzioni quelle con l'id indicato
            if (req.query.id) {
                filteredProduzioni = filteredProduzioni.filter((produzione) => produzione.id == req.query.id);
            }
            //Se sto filtrando per idproduzione, cerco nelle produzioni quelle con l'una produzione di prodotto con id indicato
            if(req.query.idproduzione){
                filteredProduzioni = filteredProduzioni.filter((produzione) => {
                    return produzione.produzione.some(produzione => produzione.id == req.query.idproduzione);
                });
            }

            //Se sto filtrando per data, cerco nelle produzioni quelle che hanno una data compresa tra startDate e endDate
            //Altrimenti ritorno i dati filtrati cosi come sono
            if (!startDate && !endDate) {
                res.json(filteredProduzioni);
            } 
            else {
                filteredProduzioni = filteredProduzioni.filter((produzione) => {
                    //Normalizzo la data che sto considerando
                    const currentDate = new Date(produzione.data).setHours(0, 0, 0, 0);
                    return currentDate >= startDate && currentDate <= endDate;
                });

                //resituisco i dati filtrati per la data
                res.json(filteredProduzioni);
            }
        }
    });
});

//Interroga i dati delle vendite
//Es chiamata http://localhost:3001/api/data/vendite?id=0&valore=13000&quantita=13000&idprodotto=0&startDate=2019-01-01&endDate=2019-09-29
app.get('/api/data/vendite', (req, res) => {
    //Leggo le date di inizio e fine, se passate, altrimenti sono null
    const startDate = req.query.startDate ? new Date(req.query.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate).setHours(0, 0, 0, 0) : null;

    //Il datarange deve essere specificato se almeno uno dei due è impostato
    if ((!startDate && endDate) || (startDate && !endDate)) {
        res.status(400).send('Mancano startDate o endDate');
        return;
    }

    //Leggo il dataset
    fs.readFile('Dataset_Vendite.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Vendite');
        } 
        else {
            //Prendo tutto il dataset delle vendite
            const vendite = JSON.parse(data);
            //Preparo il filtro
            let filteredVendite = vendite;
            //Se sto filtrando per id, cerco nelle vendite quelle con l'id indicato
            if (req.query.id) {
                filteredVendite = filteredVendite.filter((vendita) => vendita.id == req.query.id);
            }
            //Se sto filtrando per valore, cerco nelle vendite quelle con valore uguale o superiore a quello indicato
            if (req.query.valore) {
                filteredVendite = filteredVendite.filter((vendita) => vendita.valoreVendita >= req.query.valore);
            }
            //Se sto filtrando per quantita, cerco nelle vendite quelle con quantita uguale o superiore a quella indicata
            if (req.query.quantita) {
                filteredVendite = filteredVendite.filter((vendita) => vendita.quantita >= req.query.quantita);
            }
            //Se sto filtrando per idprodotto, cerco nelle vendite quali hanno come idprodotto quello indicato
            if(req.query.idprodotto){
                filteredVendite = filteredVendite.filter((vendita) => {
                    return vendita.prodotto.id == req.query.idprodotto;
                });
            }

            //Se sto filtrando per data, cerco nelle vendite quelli che hanno una data compresa tra startDate e endDate
            //Altrimenti ritorno i dati filtrati cosi come sono
            if (!startDate && !endDate) {
                res.json(filteredVendite);
            } 
            else {
                filteredVendite = filteredVendite.filter((vendita) => {
                    //Normalizzo la data che sto considerando
                    const currentDate = new Date(vendita.data).setHours(0, 0, 0, 0);
                    return currentDate >= startDate && currentDate <= endDate;
                });

                 //resituisco i dati filtrati per la data
                res.json(filteredVendite);
            }
        }
    });
});

//Interroga i dati delle perdite
//Es chiamata http://localhost:3001/api/data/perdite?id=0&valore=13000&quantita=13000&idprodotto=0&startDate=2019-01-01&endDate=2019-09-29
app.get('/api/data/perdite', (req, res) => {
    //Leggo le date di inizio e fine, se passate, altrimenti sono null
    const startDate = req.query.startDate ? new Date(req.query.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate).setHours(0, 0, 0, 0) : null;

    //Il datarange deve essere specificato se almeno uno dei due è impostato
    if ((!startDate && endDate) || (startDate && !endDate)) {
        res.status(400).send('Mancano startDate o endDate');
        return;
    }

    //Leggo il dataset
    fs.readFile('Dataset_Perdite.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Perdite');
        } 
        else {
            //Prendo tutto il dataset delle perdite
            const perdite = JSON.parse(data);
            //Preparo il filtro
            let filteredPerdite = perdite;
            //Se sto filtrando per id, cerco nelle perdite quelle con l'id indicato
            if (req.query.id) {
                filteredPerdite = filteredPerdite.filter((perdita) => perdita.id == req.query.id);
            }
            //Se sto filtrando per valore, cerco nelle perdite quelle con valore uguale o superiore a quello indicato
            if (req.query.valore) {
                filteredPerdite = filteredPerdite.filter((perdita) => perdita.valorePerdita >= req.query.valore);
            }
            //Se sto filtrando per quantita, cerco nelle perdite quelle con quantita uguale o superiore a quella indicata
            if (req.query.quantita) {
                filteredPerdite = filteredPerdite.filter((perdita) => perdita.quantita >= req.query.quantita);
            }
            //Se sto filtrando per idprodotto, cerco nelle perdite quali hanno come idprodotto quello indicato
            if(req.query.idprodotto){
                filteredPerdite = filteredPerdite.filter((perdita) => {
                    return perdita.prodotto.id == req.query.idprodotto;
                });
            }

            //Se sto filtrando per data, cerco nelle perdite quelle che hanno una data compresa tra startDate e endDate
            //Altrimenti ritorno i dati filtrati cosi come sono
            if (!startDate && !endDate) {
                res.json(filteredPerdite);
            } 
            else {
                filteredPerdite = filteredPerdite.filter((perdita) => {
                    //Normalizzo la data che sto considerando
                    const currentDate = new Date(perdita.data).setHours(0, 0, 0, 0);
                    return currentDate >= startDate && currentDate <= endDate;
                });

                //resituisco i dati filtrati per la data
                res.json(filteredPerdite);
            }
        }
    });
});

//Interroga i dati dei costi
//Es chiamata http://localhost:3001/api/data/costi?id=9&startDate=2019-01-01&endDate=2025-01-01&costopersonale=90000&costoperdita=2500
app.get('/api/data/costi', (req, res) => {
    //Leggo le date di inizio e fine, se passate, altrimenti sono null
    const startDate = req.query.startDate ? new Date(req.query.startDate).setHours(0, 0, 0, 0) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate).setHours(0, 0, 0, 0) : null;

    //Il datarange deve essere specificato se almeno uno dei due è impostato
    if ((!startDate && endDate) || (startDate && !endDate)) {
        res.status(400).send('Mancano startDate o endDate');
        return;
    }

    //Leggo il dataset
    fs.readFile('Dataset_Costi.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Errore nella lettura dei dati - Costi');
        } 
        else {
            //Prendo tutto il dataset dei costi
            const costi = JSON.parse(data);
            //Preparo il filtro
            let filteredCosti = costi;
            //Se sto filtrando per id, cerco nei costi quelli con l'id indicato
            if (req.query.id) {
                filteredCosti = filteredCosti.filter((costo) => costo.id == req.query.id);
            }
            //Se sto filtrando per costopersonale, cerco nei costi quelli con valore uguale o superiore a quello indicato
            if (req.query.costopersonale) {
                filteredCosti = filteredCosti.filter((costo) => costo.costopersonale >= req.query.costopersonale);
            }
            //Se sto filtrando per costoperdita, cerco nei costi quelli con valore uguale o superiore a quello indicato
            if (req.query.costoperdita) {
                filteredCosti = filteredCosti.filter((costo) => costo.costoperdita >= req.query.costoperdita);
            }

            //Se sto filtrando per data, cerco nelle perdite quelle che hanno una data compresa tra startDate e endDate
            //Altrimenti ritorno i dati filtrati cosi come sono
            if (!startDate && !endDate) {
                res.json(filteredCosti);
            } 
            else {
                filteredCosti = filteredCosti.filter((perdita) => {
                    //Normalizzo la data che sto considerando
                    const currentDate = new Date(perdita.data).setHours(0, 0, 0, 0);
                    return currentDate >= startDate && currentDate <= endDate;
                });

                //resituisco i dati filtrati per la data
                res.json(filteredCosti);
            }
        }
    });
});

//Chiamata per generare un nuovo DataSet
app.get('/api/data/genera-dataset', (req, res) => {
    generaDataSet();
    res.json({ messaggio: 'Dataset generato'}).status(200);
});

//Inizializza il webservice
app.listen(port, () => {
    console.log(`Server attivo su http://localhost:${port}`);
});