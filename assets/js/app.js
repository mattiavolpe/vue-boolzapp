/*
Iniziamo il primo esercizio lungo di vuejs, la replica della famosa app di messaggistica.

Milestone 1
Replica della grafica con la possibilità di avere messaggi scritti dall’utente (verdi) e dall’interlocutore (bianco) assegnando due classi CSS diverse
Visualizzazione dinamica della lista contatti: tramite la direttiva v-for, visualizzare nome e immagine di ogni contatto

Milestone 2
Visualizzazione dinamica dei messaggi: tramite la direttiva v-for, visualizzare tutti i messaggi relativi al contatto attivo all’interno del pannello della conversazione
Click sul contatto mostra la conversazione del contatto cliccato

Milestone 3
Aggiunta di un messaggio: l'utente scrive un testo nella parte bassa e digitando "enter" il testo viene aggiunto al thread sopra, come messaggio verde
Risposta dall'interlocutore: ad ogni inserimento di un messaggio, l'utente riceverà un "ok" come risposta, che apparirà dopo 1 secondo.

Milestone 4
Ricerca utenti: scrivendo qualcosa nell'input a sinistra, vengono visualizzati solo i contatti il cui nome contiene le lettere inserite (es, Marco, Matteo Martina -> Scrivo "mar" rimangono solo Marco e Martina)

Milestone 5
Cancella messaggio: cliccando sul messaggio appare un menu a tendina che permette di cancellare il messaggio selezionato.
Visualizzazione ora e ultimo messaggio inviato/ricevuto nella lista dei contatti
*/

const { createApp } = Vue
  
createApp({
  data() {
    return {
      myArray: [],
      activeContact: 0,
      newMessage: null,
      contactToSearch: "",
      messageToRemove: -1,
      contacts: [
        {
          name: 'Michele',
          avatar: './img/avatar_1.png',
          visible: true,
          messages: [
            {
              date: '10/01/2020 15:30:55',
              message: 'Hai portato a spasso il cane?',
              status: 'sent'
            },
            {
              date: '10/01/2020 15:50:00',
              message: 'Ricordati di stendere i panni',
              status: 'sent'
            },
            {
              date: '10/01/2020 16:15:22',
              message: 'Tutto fatto!',
              status: 'received'
            }
          ],
        },
        {
          name: 'Fabio',
          avatar: './img/avatar_2.png',
          visible: true,
          messages: [
            {
              date: '20/03/2020 16:30:00',
              message: 'Ciao come stai?',
              status: 'sent'
            },
            {
              date: '20/03/2020 16:30:55',
              message: 'Bene grazie! Stasera ci vediamo?',
              status: 'received'
            },
            {
              date: '20/03/2020 16:35:00',
              message: 'Mi piacerebbe ma devo andare a fare la spesa.',
              status: 'sent'
            }
          ],
        },
        {
          name: 'Samuele',
          avatar: './img/avatar_3.png',
          visible: true,
          messages: [
            {
              date: '28/03/2020 10:10:40',
              message: 'La Marianna va in campagna',
              status: 'received'
            },
            {
              date: '28/03/2020 10:20:10',
              message: 'Sicuro di non aver sbagliato chat?',
              status: 'sent'
            },
            {
              date: '28/03/2020 16:15:22',
              message: 'Ah scusa!',
              status: 'received'
            }
          ],
        },
        {
          name: 'Alessandro B.',
          avatar: './img/avatar_4.png',
          visible: true,
          messages: [
            {
              date: '10/01/2020 15:30:55',
              message: 'Lo sai che ha aperto una nuova pizzeria?',
              status: 'sent'
            },
            {
              date: '10/01/2020 15:50:00',
              message: 'Si, ma preferirei andare al cinema',
              status: 'received'
            }
          ],
        },
        {
          name: 'Alessandro L.',
          avatar: './img/avatar_5.png',
          visible: true,
          messages: [
            {
              date: '10/01/2020 15:30:55',
              message: 'Ricordati di chiamare la nonna',
              status: 'sent'
            },
            {
              date: '10/01/2020 15:50:00',
              message: 'Va bene, stasera la sento',
              status: 'received'
            }
          ],
        },
        {
          name: 'Claudia',
          avatar: './img/avatar_6.png',
          visible: true,
          messages: [
            {
              date: '10/01/2020 15:30:55',
              message: 'Ciao Claudia, hai novità?',
              status: 'sent'
            },
            {
              date: '10/01/2020 15:50:00',
              message: 'Non ancora',
              status: 'received'
            },
            {
              date: '10/01/2020 15:51:00',
              message: 'Nessuna nuova, buona nuova',
              status: 'sent'
            }
          ],
        },
        {
          name: 'Federico',
          avatar: './img/avatar_7.png',
          visible: true,
          messages: [
            {
              date: '10/01/2020 15:30:55',
              message: 'Fai gli auguri a Martina che è il suo compleanno!',
              status: 'sent'
            },
            {
              date: '10/01/2020 15:50:00',
              message: 'Grazie per avermelo ricordato, le scrivo subito!',
              status: 'received'
            }
          ],
        },
        {
          name: 'Davide',
          avatar: './img/avatar_8.png',
          visible: true,
          messages: [
            {
              date: '10/01/2020 15:30:55',
              message: 'Ciao, andiamo a mangiare la pizza stasera?',
              status: 'received'
            },
            {
              date: '10/01/2020 15:50:00',
              message: 'No, l\'ho già mangiata ieri, ordiniamo sushi!',
              status: 'sent'
            },
            {
              date: '10/01/2020 15:51:00',
              message: 'OK!!',
              status: 'received'
            }
          ],
        }
      ],
      orderedContacts: [],
    }
  },
  methods: {
    orderContacts() {
      this.orderedContacts = [...this.contacts].sort((dateA, dateB) => {
        let splittedDateA;
        let splittedDateB;
        if (dateA.messages.length === 0) {
          splittedDateA = ["00/00/0000", "00:00:00"];
          if (dateB.messages.length === 0) {
            splittedDateB = ["00/00/0000", "00:00:00"];
          } else {
            splittedDateB = dateB.messages[dateB.messages.length - 1].date.split(" ");
          }
        } else if (dateB.messages.length === 0) {
          splittedDateA = dateA.messages[dateA.messages.length - 1].date.split(" ");
          splittedDateB = ["00/00/0000", "00:00:00"];
        } else {
          splittedDateA = dateA.messages[dateA.messages.length - 1].date.split(" ");
          splittedDateB = dateB.messages[dateB.messages.length - 1].date.split(" ");
        }
        const yearA = splittedDateA[0].split("/")[2];
        const monthA = splittedDateA[0].split("/")[1];
        const dayA = splittedDateA[0].split("/")[0];
        const hoursA = splittedDateA[1].split(":")[0];
        const minutesA = splittedDateA[1].split(":")[1];
        const secondsA = splittedDateA[1].split(":")[2];
        const completeStringA = `${yearA+monthA+dayA+hoursA+minutesA+secondsA}`;
        const yearB = splittedDateB[0].split("/")[2];
        const monthB = splittedDateB[0].split("/")[1];
        const dayB = splittedDateB[0].split("/")[0];
        const hoursB = splittedDateB[1].split(":")[0];
        const minutesB = splittedDateB[1].split(":")[1];
        const secondsB = splittedDateB[1].split(":")[2];
        const completeStringB = `${yearB+monthB+dayB+hoursB+minutesB+secondsB}`;
        return completeStringB - completeStringA;
      });
      return this.orderedContacts;
    },
    provideLastMessageDate() {
      const actualContact = this.orderedContacts[this.activeContact];
      let timeString = actualContact.messages[actualContact.messages.length - 1].date.slice(0, 10);
      const today = new Date().toLocaleDateString('it-IT', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      });
      if (timeString == today) {
        timeString = "today";
      }
      return timeString;
    },
    provideLastMessageTime() {
      const actualContact = this.orderedContacts[this.activeContact];
      if (actualContact.messages.length === 0) {
        const timeString = `${new Date().getHours()}:${new Date().getMinutes()}`;
        return timeString;
      }
      const timeString = actualContact.messages[actualContact.messages.length - 1].date.slice(11, 16);
      return timeString;
    },
    getActualTime() {
      let actualTime = new Date();
      actualTime = actualTime.toLocaleTimeString();
      actualTime = actualTime.slice(0, 5)
      return actualTime;
    },
    sendNewMessage() {
      if (this.newMessage === null || this.newMessage.length === 0) {
        return;
      }
      const newMessageObject = {
        date: this.actualTime(),
        message: this.newMessage,
        status: 'sent'
      }
      this.orderedContacts[this.activeContact].visible = true;
      this.orderedContacts[this.activeContact].messages.push(newMessageObject);
      this.activeContact = 0;
      this.orderContacts();
      this.scrollToBottom();
      this.newMessage = null;
      this.sendAnswer();
    },
    actualTime() {
      const now = new Date();
      const date = now.toLocaleDateString('it-IT', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      });
      let hours = now.getHours();
      if (hours < 10) {
        hours = `0${hours.toString()}`;
      }
      let minutes = now.getMinutes();
      if (minutes < 10) {
        minutes = `0${minutes.toString()}`;
      }
      let seconds = now.getSeconds();
      if (seconds < 10) {
        seconds = `0${seconds.toString()}`;
      }
      return `${date} ${hours}:${minutes}:${seconds}`;
    },
    sendAnswer() {
      setTimeout(() => {
        const newAnswer = {
          date: this.actualTime(),
          message: 'Ok',
          status: 'received'
        }
        this.orderContacts();
        this.scrollToBottom();
        this.orderedContacts[this.activeContact].messages.push(newAnswer);
      }, 1000);
    },
    searchContacts(contact) {
      if (contact.name.toLowerCase().includes(this.contactToSearch.trim().toLowerCase())) {
        return true;
      }
      else {
        return false;
      }
    },
    removeMessage(message) {
      this.orderedContacts[this.activeContact].lastUser = true;
      this.orderedContacts[this.activeContact].messages.splice(this.orderedContacts[this.activeContact].messages.indexOf(message), 1);
      if (this.orderedContacts[this.activeContact].messages.length === 0) {
        this.orderedContacts[this.activeContact].visible = false;
        this.orderContacts();
        this.activeContact = this.orderedContacts.findIndex(contact => contact.lastUser);
        delete this.orderedContacts[this.activeContact].lastUser;
        return;
      }
      this.orderContacts();
      this.activeContact = this.orderedContacts.findIndex(contact => contact.lastUser);
      this.messageToRemove = -1
    },
    // FUNCTION USED TO SCROLL TO THE NEWEST MESSAGE WHEN A NEW MESSAGE IS SENT / RECEIVED
    scrollToBottom() {
      const mainContent = document.getElementById("right_main_content");
      mainContent.scrollTo(0, 0);
    },
    contactFound(contact) {
      return this.contactToSearch.trim() != '' && this.searchContacts(contact);
    },
    hasMessages(contact) {
      return contact.visible === true && this.contactToSearch.trim() === '';
    },
  },
  created() {
    this.orderContacts();
  }
}).mount('#app')