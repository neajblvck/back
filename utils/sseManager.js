// /utils/sseManager.js

let clients = [];

function sendToAllClients(data) {
    clients.forEach(client => client.write(`data: ${JSON.stringify(data)}\n\n`));
}


function addClient(client, sessionId) {
    console.log(sessionId)
    clients.push(client);
}

function removeClient(client) {
    clients = clients.filter(c => c !== client);
}

module.exports = { sendToAllClients, addClient, removeClient };
