const express = require('express');
const router = express.Router();
const depenseController = require('../controllers/depense.controller');

router.post('/add', depenseController.addDepense);



module.exports = router;