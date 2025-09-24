/*Controller (Contrôleur)

Rôle : gérer la logique métier et les actions liées aux requêtes HTTP.

Reçoit les requêtes depuis les routes, appelle le modèle pour manipuler les données, puis renvoie une réponse au client.*/

const bcrypt = require("bcryptjs");
const User = require("../model/user.model");


//générer un mot de passe aléatoire pour un utilisateur qui s inscrit pour la 1ere fois
function generatePassword(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

const authController = {
    //inscrire un nouvel utilisateur.
register: async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });

    const existing = await User.findByEmail(email);
    if (existing) return res.status(400).json({ error: "Email déjà utilisé" });

    // Génération du mot de passe temporaire en clair
   const tempPassword = generatePassword(10);


    // Hash du mot de passe avant insertion en base
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Création de l'utilisateur en base
    const userId = await User.create(email, hashedPassword);

    // Démarrer la session
    req.session.userId = userId;

    // Retourner le mot de passe clair au frontend
    res.status(201).json({
      message: "Inscription réussie",
      password: tempPassword
    });
  } catch (error) {
    console.error("Erreur dans register:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
},


  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

      req.session.userId = user.id;
      res.json({ message: "Connexion réussie" });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.json({ message: "Déconnecté" });
  },
};

module.exports = authController;
