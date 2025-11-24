
const Depense = require('../model/depense.model');
const User = require('../model/user.model');


exports.addDepense = async (req, res) => {
  try {
    const user_id = req.session.userId;
    const { nom, description, montant, categorie } = req.body;

    if (!nom || !montant || !categorie) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
    }

    // ajouter la depense
    await Depense.addDepense(nom, description, montant, categorie, user_id);

    // decrementer  le salaire aprs depenses
    await User.updateSalaire(user_id, montant);

    // Recuperer le salaire actuel
    const user = await User.findById(user_id);
    const salaireRestant = parseFloat(user.salaire);


    // recuperer toutes les depenses du mois pour calcul du pourcentage
    const depensesMois = await Depense.getDepensesDuMois(user_id);
    const totalDepenseMois = depensesMois.reduce((acc, d) => acc + parseFloat(d.montant), 0);

    const salaireInitial = parseFloat(user.salaire) + totalDepenseMois;  // estimation du salaire initial
    const pourcentageDepense = (totalDepenseMois / salaireInitial) * 100;

    const alert = pourcentageDepense >= 80;  //un bool sera true des que l user a depense 80% ou plus de son salaire , et false sinon.

    
    res.status(201).json({
      success: true,
      alert,          
      salaireRestant
    });

  } catch (error) {
    console.error('Erreur lors de l’ajout de la dépense:', error);
    res.status(500).json({success: false, message: 'Erreur serveur.' });
  }
};

//une fct  pour fetcher les depenses de l'utilisateur et les afficher dans son historique

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



