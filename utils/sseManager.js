const SSEClient = require('../utils/sseClient');

class SSEManager {
  constructor() {
    /* On garde une liste de tous les clients connectés */
    this.clients = new Map();
  }

  /**
   * Initialise une nouvelle connexion avec un client
   * @function open
   * @param {number|string} clientId - L'identifiant du client
   * @param {Object} context - La réponse HTTP
   */
  open(clientId, context) {
    console.log('open clientId', clientId)
    const client = new SSEClient(context);
    client.initialize();
    this.clients.set(clientId, client);


    // Envoyer l'ID au client comme premier message
    this.unicast(clientId, {
      id: Date.now(),
      type: 'clientId',
      data: clientId
    });
  }

  /**
   * Supprime un client
   * @function delete
   * @param {number|string} clientId - L'identifiant du client
   */
  delete(clientId) {
    this.clients.delete(clientId);
  }

  /**
   * Supprime tous les clients
   * @function deleteAll
   */
  deleteAll() {
    this.clients.clear();
  }

  /**
   * Envoie un message à un seul client
   * @function unicast
   * @param {number|string} clientId - L'identifiant du client
   * @params {Object} message - Le message à envoyer au client
   * @params {number|string} [message.id] - L'identifiant unique du message
   * @params {string} [message.type='message'] - Le type de message
   * @params {number} [message.retry] - Le délai en millisecondes avant une tentative de reconnexion au serveur
   * @params {string} message.data - Le contenu du message
   */
  unicast(clientId, message) {
    const client = this.clients.get(clientId);
    if (client) {
      client.send(message);
    }
  }

  /**
   * Envoie un message à tout les clients
   * @function broadcast
   * @params {Object} message - Le message à envoyer aux clients
   * @params {number|string} [message.id] - L'identifiant unique du message
   * @params {string} [message.type='message'] - Le type de message
   * @params {number} [message.retry] - Le délai en millisecondes avant une tentative de reconnexion au serveur
   * @params {string} message.data - Le contenu du message
   */
  broadcast(message) {
    for (const [id] of this.clients) {
      this.unicast(id, message);
    }
  }

  /**
   * Envoie un message à une liste de client
   * @function multicast
   * @param {Array} clientIds - Les identifiants des clients
   * @params {object} message - Le message à envoyer aux clients
   * @params {number|string} [message.id] - L'identifiant unique du message
   * @params {string} [message.type='message'] - Le type de message
   * @params {number} [message.retry] - Le délai en millisecondes avant une tentative de reconnexion au serveur
   * @params {string} message.data - Le contenu du message
   */
  multicast(clientIds, message) {
    for (const id of clientIds) {
      this.unicast(id, message);
    }
  }

  /**
   * Retourne le nombre de clients connectés
   * @function count
   * @returns {number}
   */
  count() {
    return this.clients.size;
  }
}

module.exports = SSEManager;