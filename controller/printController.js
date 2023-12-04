const printService = require('../service/printService');

exports.printOrder = async (req, res) => {
    try {
      const orderData = req.body;
      await printService.printOrder(orderData);
      res.status(200).json({ message: 'Commande imprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de l\'impression', error: error.message });
    }
  };
  