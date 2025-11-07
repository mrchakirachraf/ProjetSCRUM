const express = require('express');
const router = express.Router();
const depenseController = require('../controllers/depense.controller');

router.post('/add', depenseController.addDepense);
//route pour recuperer l'historique de l'utilisateur.
router.get('/all', depenseController.getDepenses);
router.get('/weekly-summary', depenseController.getWeeklySummary);

module.exports = router;