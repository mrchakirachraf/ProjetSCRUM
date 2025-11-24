const User = require("../model/user.model");

const userController = {
  completeProfile: async (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: "Non autorisé" });

    try {
      const { nom, prenom, age, salaire, epargne_vie,profession } = req.body;
      await User.updateProfile(req.session.userId, {  nom, prenom, age, salaire, epargne_vie,profession });
      res.json({ message: "Profil complété avec succès" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },
};

module.exports = userController;


