import { getData } from './apiService';

//Servizio mock per gestire i dati dell'utente
//Andrebbe implementata tutta la logica di login, controllo password, logout, ecc.
class UserService {
  //Preparo una variabile per contenere l'oggetto dell'utente
  currentUser = {};
  //Funzione per interrogare quale utente loggare
  async fetchDataUtenti() {
      try {
        //Eseguo la chiamata al backend ed artificiosamente richiamo l'utente 0, l'amministratore
        const userData = await getData('/api/data/utenti?id=0');
        //Imposto l'oggetto di ritorno come l'utente loggato
        this.currentUser = userData[0];
      } catch (error) {
        console.error('Errore caricamento dati utenti:', error);
      }
  }
  //Quando viene istanziato il service, carico i dati dell'utente 
  constructor() {
    this.fetchDataUtenti();
  }
  //Funzione che permette ai componenti che importano il servizio di ottenere l'utente loggato
  async getCurrentUser() {
    //Se l'utente loggato non esiste, lo chiamo tramite fetchDataUtenti
    if (Object.keys(this.currentUser).length === 0) { 
      await this.fetchDataUtenti(); 
    }
    //Altrimenti ritorno la variabile che contiene l'utente
    return this.currentUser;
  }
}
//Creo un istanza del service e la esporto
const userService = new UserService();

export default userService;