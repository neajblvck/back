const printService = require('../service/printService');

exports.printOrder = async (req, res) => {
    try {


      const printConfig = {
        connectionType: 'Network',
        printerIP: '192.168.1.89'
    }
    const ticketData = {
      shopCartData: req.body.shopCartData,
      callbackID: req.body.callbackID,
      orderType: req.body.orderType
    }
    

      await printService.printOrder(printConfig, ticketData);
      res.status(200).json({ message: 'Commande imprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'impression', error: error.message });
    }
  };
  