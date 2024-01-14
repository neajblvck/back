const escpos = require('escpos');
escpos.USB = require('escpos-usb');
escpos.Network = require('escpos-network');

async function printOrder(printConfig, ticketData) {
  let device;

  // Choisir le dispositif en fonction du type de connexion
  if (printConfig.connectionType === 'USB') {
    device = new escpos.USB();
  } else if (printConfig.connectionType === 'Network') {
    device = new escpos.Network(printConfig.printerIP); // Assurez-vous que l'adresse IP est fournie dans printConfig
  } else {
    throw new Error('Type de connexion non supporté');
  }

  const options = { encoding: "ISO-8859-1" };
  const printer = new escpos.Printer(device, options);

  try {
    await openDevice(device);
    printKitchenTicket(printer, ticketData);
    printer.cut().close();
  } catch (error) {
    console.error('Erreur lors de l\'impression :', error);
    throw error;
  }
}

async function openDevice(device) {
  return new Promise((resolve, reject) => {
    device.open(error => {
      if (error) {
        console.error("Erreur de connexion à l'imprimante :", error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function printKitchenTicket(printer, ticketData) {
  // Impression du contenu de la commande
  printer
  .align('ct')
  .style('b') // Style en gras et souligné pour le titre
  
  .size(1, 1)
  .text('-------------------')
  .size(1, 3)
  .text(`COMMANDE ${ticketData.callbackID}`)
  .style('b') // Appliquer le style gras
  .size(1, 1)
  .text('-------------------')
  .text(`${ticketData.orderType}`)
  .control('lf')
  .style('normal'); // Retour au style normal pour le reste du texte

  ticketData.shopCartData.forEach(product => {
    printer
      .align('lt')
      .style('b')
      .size(1, 1)
      .style('normal')
      .control('lf')
      .text(`x${product.quantity} ${product.nameProduct.toUpperCase()}`)
      .size(1, 1)
    product.selectedOptions.forEach(option => {
      option.choices.forEach(choice =>{
        printer.text(`   - ${choice.name}`);
      } )
    });
  });
}

module.exports = { printOrder };
