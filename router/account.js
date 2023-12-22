// ROUTER ACCOUNT

const express = require('express');
const router = express.Router();

const tenantController = require('../controller/tenant.js');

router.post('/register', tenantController.registerTenant);


module.exports = router;