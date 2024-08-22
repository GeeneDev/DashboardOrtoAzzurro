//Questo servizio serve per effettuare tutte le chiamate al backend e restituire gli oggetti JSON
//URL di base verso il backend
const baseUrl = 'http://localhost:3001';

//Funzione per gestire la risposta del backend e lanciare un errore se la chiamata non va a buon fine
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Errore nella chiamata');
    }
    return response.json();
};

//Funzione per effettuare le chiamate GET al backend dai componenti che usano il servizio
//endpoint e' il parametro di destinazione dell'endpoint backend API passato dai componenti chiamanti
export const getData = async (endpoint) => {
    try {
        //Effettuo la chiamata al backend concatenando baseUrl ed endpoint
        const response = await fetch(`${baseUrl}${endpoint}`, {
            //Imposto i parametri per la chiamata
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Errore nel reperire i dati:', error);
        throw error;
    }
};

//Funzione per effettuare una chiamata POST al backend, non utilizzata, ma inserita per completezza
//endpoint e' il parametro di destinazione dell'endpoint backend API passato dai componenti chiamanti
//data e' l'oggetto da inviare al backend
export const postData = async (endpoint, data) => {
    try {
       //Effettuo la chiamata al backend concatenando baseUrl ed endpoint
      const response = await fetch(`${baseUrl}${endpoint}`, {
        //Imposto i parametri per la chiamata
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Errore nello scrivere i dati:', error);
      throw error;
    }
  };
  