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

const { createApp } = Vue;
  
createApp({
  data() {
    return {
      darkMode: false,
      counter: -1, // ID used to track which contact has to answer to a new message, since activeContact will change if the user selects another contact before the 1 second of waiting time
      activeContact: -1,
      newMessage: "",
      searchQuery: "",
      messageToRemove: -1, // The index of the message to remove
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
          name: 'Sofia',
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
      orderedContacts: [], // The array of chronologically ordered chats
    }
  },
  methods: {
    /**
     * Takes the original array and sorts the contacts in descending chronological order, so that the one that has the newest message, is on top of the contacts list
     * @returns An array of objects containing the chronologically ordered chats
     */
    orderContacts() {
      this.orderedContacts = [...this.contacts].sort((contactA, contactB) => {
        let splittedDatesAndTimes = this.getDatesAndTimes(contactA, contactB);
        
        const completeDateAString = this.composeDateAndTimeString(splittedDatesAndTimes[0]);
        const completeDateBString = this.composeDateAndTimeString(splittedDatesAndTimes[1]);
        return completeDateBString - completeDateAString;
      });
      return this.orderedContacts;
    },

    /**
     * Takes two contacts and returns, for each one of them, an array containing it's latest message date and time 
     * @param {object} contactA The first contact to be sorted
     * @param {object} contactB The second contact to be sorted
     * @returns Two arrays, each one containing the correctly formatted date and time of the latest message of the contact
     */
    getDatesAndTimes(contactA, contactB) {
      let splittedDateA = [];
      let splittedDateB = [];

      // Check if any of the 2 contacts has no more messages
      if (contactA.messages.length === 0) {
        splittedDateA = ["00/00/0000", "00:00:00"];
        if (contactB.messages.length === 0) {
          splittedDateB = ["00/00/0000", "00:00:00"];
        } else {
          splittedDateB = contactB.messages[contactB.messages.length - 1].date.split(" ");
        }
      } else if (contactB.messages.length === 0) {
        splittedDateA = contactA.messages[contactA.messages.length - 1].date.split(" ");
        splittedDateB = ["00/00/0000", "00:00:00"];
      } else {
        splittedDateA = contactA.messages[contactA.messages.length - 1].date.split(" ");
        splittedDateB = contactB.messages[contactB.messages.length - 1].date.split(" ");
      }
      return [splittedDateA, splittedDateB];
    },

    /**
     * Takes the date and the time of the latest message in a chat and combines them in a single word that will be used to chronologically order messages
     * @param {string[]} dateArray An array of string containing two elements: the date and the time
     * @returns A string that combines the date and the time in a single word that will be used to chronologically order messages
     */
    composeDateAndTimeString(dateArray) {
      const datePart = dateArray[0];
      const timePart = dateArray[1];
      const year = datePart.split("/")[2];
      const month = datePart.split("/")[1];
      const day = datePart.split("/")[0];
      const hours = timePart.split(":")[0];
      const minutes = timePart.split(":")[1];
      const seconds = timePart.split(":")[2];
      const completeString = `${year+month+day+hours+minutes+seconds}`;
      return completeString;
    },

    /**
     * Takes the currently iterated contact and returns it's initials if it has no avatar
     * @param {object} contact The currently iterated contact
     * @returns A string containing the initials of the contact
     */
    findInitials(contact) {
      const nameParts = contact.name.split(" ");
      let initials = "";
      nameParts.forEach(part => {
        initials += part[0];
      });
      return initials;
    },

    /**
     * Takes the latest message in the chat between the user and the active contact, and returns it's date
     * @returns A string containing the date of the latest message in the chat between the user and the active contact
     */
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

    /**
     * Takes the latest message in the chat between the user and the active contact, and returns it's time
     * @returns A string containing the time of the latest message in the chat between the user and the active contact
     */
    provideLastMessageTime() {
      const actualContact = this.orderedContacts[this.activeContact];
      const timeString = actualContact.messages[actualContact.messages.length - 1].date.slice(11, 16);
      return timeString;
    },

    /**
     * Returns a string containing the current time and uses it as the latest seen time for the active contact in case there are no left messages in the chat
     * @returns A string containing the current time
     */
    getCurrentTime() {
      let currentTime = new Date();
      currentTime = currentTime.toLocaleTimeString();
      currentTime = currentTime.slice(0, 5)
      return currentTime;
    },

    /**
     * Returns a string containing the current date and time and uses it as the date property of the new message
     * @returns A string containing the current date and time
     */
    getFormattedCurrentDateAndTime() {
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

    /**
     * Takes the message written by the user and sends it as the newest message in the chat between the user and the contact
     */
    sendNewMessage() {

      // Avoids to send an empty message
      if (this.newMessage === "" || this.newMessage.trim().length === 0) {
        return;
      }

      const newMessageObject = {
        date: this.getFormattedCurrentDateAndTime(),
        message: this.newMessage,
        status: 'sent'
      }

      // Sets the visibility back to true in case there are no other messages in the chat
      this.orderedContacts[this.activeContact].visible = true; 

      // Sends the message to the contact array of messages
      this.orderedContacts[this.activeContact].messages.push(newMessageObject);

      // Sets the ID of the contact to track who has to receive the following answer
      const contactWaitingForAnswer = this.orderedContacts[this.activeContact].id;

      this.orderContacts();
      this.scrollTo("top");
      setTimeout(() => {
        this.scrollTo("bottom");
      }, 1); // 1ms needed to make the scroll to bottom work as expected
      this.activeContact = 0;
      this.newMessage = "";
      this.sendAnswer(contactWaitingForAnswer);
    },

    /**
     * Sends an answer 1 second after the user's new message
     * @param {number} contactId The ID of the contact that has received a new message and has to answer
     */
    sendAnswer(contactId) {
      setTimeout(() => {
        const newAnswer = {
          date: this.getFormattedCurrentDateAndTime(),
          message: 'Ok',
          status: 'received'
        }

        // Sends the answer to the contact with the provided ID, so the answer is delivered to the right contact also if the user clicks on another contact in the 1 second waiting time
        this.orderedContacts[this.orderedContacts.findIndex(contact => contact.id == contactId)].messages.push(newAnswer);

        setTimeout(() => {
          this.scrollTo("bottom");
        }, 1); // 1ms needed to make the scroll to bottom work as expected
      }, 1000);
    },

    /**
     * Returns a boolean value for every iterated contact whos name contains the text inserted by the user in the "search" field to filter contacts by name
     * @param {object} contact The currently iterated contact
     * @returns A boolean value if the contact's name contains the text inserted by the user in the "search" field
     */
    searchContacts(contact) {
      if (this.searchQuery.trim() == '') {
        return false;
      }
      if (contact.name.toLowerCase().includes(this.searchQuery.trim().toLowerCase())) {
        return true;
      }
      else {
        return false;
      }
    },

    /**
     * Deletes the message the user wants to delete from the active contact messages array
     * @param {object} message The message the user wants to delete
     */
    removeMessage(message) {

      // Creates a lastUser property to know whose contact the user deleted the message
      this.orderedContacts[this.activeContact].lastUser = true;

      this.orderedContacts[this.activeContact].messages.splice(this.orderedContacts[this.activeContact].messages.indexOf(message), 1);
      
      if (this.orderedContacts[this.activeContact].messages.length === 0) {
        this.orderedContacts[this.activeContact].visible = false;
      }
      this.orderContacts();

      // Sets the contact with the deleted message as the current contact so the chat stays open also if there are no more messages
      this.activeContact = this.orderedContacts.findIndex(contact => contact.lastUser);

      delete this.orderedContacts[this.activeContact].lastUser;
      this.messageToRemove = -1
    },

    /**
     * Scrolls to the newest message and to the top of the contacts list when a new message is sent / received
     */
    scrollTo(position) {
      if (position === "top") {
        const contactsList = document.getElementById("contacts_list");
        contactsList.scrollTo(0, 0);
      } else {
        const chatContainer = document.getElementById("right_main_content");
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
      }
    },

    /**
     * Returns a boolean value to check if the user is not searching for a contact and the iterated contact still has messages in the chat with the user
     * @param {object} contact The currently iterated contact
     * @returns A boolean value to che if the iterated contact still has messages in the chat
     */
    hasMessages(contact) {
      return contact.visible === true && this.searchQuery.trim() === '';
    },

    /**
     * Toggles the theme color of the web app
     */
    toggleTheme() {
      const rootElement = document.querySelector(":root");
      this.darkMode = !this.darkMode;
      if (this.darkMode === false) {
        rootElement.style.setProperty('--bzap_chat_bg', '#efeae2');
        rootElement.style.setProperty('--bzap_bg_accent', '#00a884');
        rootElement.style.setProperty('--bzap_bg_neutral', '#dddedd');
        rootElement.style.setProperty('--bzap_headers_overlays', '#f0f2f5');
        rootElement.style.setProperty('--bzap_list_and_messages_bg', '#ffffff');
        rootElement.style.setProperty('--bzap_notification', '#53bdeb');
        rootElement.style.setProperty('--bzap_bell_background', '#ffffff');
        rootElement.style.setProperty('--bzap_icon', '#54656f');
        rootElement.style.setProperty('--bzap_main_text', '#1e1e1e');
        rootElement.style.setProperty('--bzap_secondary_text', '#8696a0');
        rootElement.style.setProperty('--bzap_active_contact', '#f0f2f5');
        rootElement.style.setProperty('--bzap_sent', '#d9fdd3');
        rootElement.style.setProperty('--bzap_checkmarks', '#70cbe6');
        rootElement.style.setProperty('--bzap_no_active_contact_bg', '#00000055');
      } else {
        rootElement.style.setProperty('--bzap_chat_bg', '#0b141a');
        rootElement.style.setProperty('--bzap_bg_accent', '#111b21');
        rootElement.style.setProperty('--bzap_bg_neutral', '#111b21');
        rootElement.style.setProperty('--bzap_headers_overlays', '#202c33');
        rootElement.style.setProperty('--bzap_list_and_messages_bg', '#111b21');
        rootElement.style.setProperty('--bzap_notification', '#182229');
        rootElement.style.setProperty('--bzap_bell_background', '#53bdeb');
        rootElement.style.setProperty('--bzap_icon', '#8696a0');
        rootElement.style.setProperty('--bzap_main_text', '#e1e1e1');
        rootElement.style.setProperty('--bzap_secondary_text', '#8696a0');
        rootElement.style.setProperty('--bzap_active_contact', '#2a3942');
        rootElement.style.setProperty('--bzap_sent', '#005c4b');
        rootElement.style.setProperty('--bzap_checkmarks', '#3ca2be');
        rootElement.style.setProperty('--bzap_no_active_contact_bg', '#ffffff55');
      }
    },
  },
  created() {
    this.orderContacts();
    this.orderedContacts.forEach(contact => contact.id = ++this.counter);
  }
}).mount('#app');