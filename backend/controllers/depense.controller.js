
const Depense = require('../model/depense.model');
const User = require('../model/user.model');


exports.addDepense = async (req, res) => {
  try {
    // Récupération automatique de l'ID de l'utilisateur connecté via la session
    const user_id = req.session.userId;
    const { nom, description, montant, categorie } = req.body;

    // Vérification des champs obligatoires
    if (!nom || !montant || !categorie) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
    }

    // 1️⃣ Ajouter la dépense
    await Depense.addDepense(nom, description, montant, categorie, user_id);

    // 2️⃣ Mettre à jour le salaire de l'utilisateur
    await User.updateSalaire(user_id, montant);

    res.status(201).json({success : true,  message: 'Dépense ajoutée et salaire mis à jour avec succès.' });

  } catch (error) {
    console.error('Erreur lors de l’ajout de la dépense:', error);
    res.status(500).json({ success : false ,message: 'Erreur serveur.' });
  }

  
};
//ajouté pour fetcher les depenses de l'utilisateur et les afficher dans son historique

exports.getDepenses = async (req, res) => {
  try {
    const user_id = req.session.userId;
    if (!user_id) return res.status(401).json({ message: "Utilisateur non connecté." });

    const depenses = await Depense.getAllDepenses(user_id);
    res.status(200).json(depenses);
  } catch (error) {
    console.error("Erreur lors de la récupération des dépenses:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
  };

  
//le recap hebdomadaire de l'utilisateur 

exports.getWeeklySummary = async (req, res) => {
  try {
    const user_id = req.session.userId;
    if (!user_id) return res.status(401).json({ message: "Utilisateur non connecté." });

    const summary = await Depense.getWeeklySummaryByUser(user_id);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Erreur lors de la récupération du récapitulatif hebdomadaire:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



