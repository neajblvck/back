const escpos = require('escpos');
escpos.USB = require('escpos-usb');
escpos.Network = require('escpos-network');

async function printOrder(orderData, connectionType) {
  let device;

  // Choisir le dispositif en fonction du type de connexion
  if (connectionType === 'USB') {
    device = new escpos.USB();
  } else if (connectionType === 'Network') {
    device = new escpos.Network(orderData.printerIP); // Assurez-vous que l'adresse IP est fournie dans orderData
  } else {
    throw new Error('Type de connexion non supporté');
  }

  const options = { encoding: "ISO-8859-1" };
  const printer = new escpos.Printer(device, options);

  try {
    await openDevice(device);
    printContent(printer, orderData);
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

function printContent(printer, orderData) {
  // Impression du contenu de la commande
  printer
    .align('ct')
    .style('bu')
    .size(1, 1)
    .text('----------------')
    .size(2, 2)
    .text(`Commande N° ${orderData.orderNumber}`)
    .size(1, 1)
    .text('----------------')
    .size(1, 1)
    .text(`Type: ${orderData.orderType}`);

  orderData.products.forEach(product => {
    printer
      .size(1, 1)
      .bold(true)
      .text(`${product.name.toUpperCase()} x${product.quantity}`)
      .bold(false);
    product.customizations.forEach(custom => {
      printer.text(` - ${custom}`);
    });
  });
}

module.exports = { printOrder };
