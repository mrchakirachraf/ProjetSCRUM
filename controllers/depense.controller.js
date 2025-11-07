
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



