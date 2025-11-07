const pool = require("../config/database");

const Depense = {
  addDepense: async (nom, description, montant, categorie, user_id) => {
    if (!nom) {
      throw new Error("Le champ 'nom' est obligatoire.");
    }

    if (!user_id) {
      throw new Error("ID utilisateur manquant.");
    }


    const desc = description !== undefined ? description : null;
    const cat = categorie !== undefined ? categorie : null;
    const mont = montant !== undefined ? montant : null;

    const [result] = await pool.execute(
      `INSERT INTO depenses (nom, description, montant, categorie, user_id, date_submission)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [nom, desc, mont, cat, user_id]
    );

    return result;
  },
  //ajouté pour fetcher les depenses de l'utilisateur 
    getAllDepenses: async (user_id) => {
    if (!user_id) throw new Error("ID utilisateur manquant.");
    const [rows] = await pool.execute(
    
      `SELECT DATE_FORMAT(date_submission, '%Y-%m-%d %H:%i') AS date_submission, nom, description, categorie, montant
       FROM depenses
       WHERE user_id = ?
       ORDER BY date_submission DESC`,
       [user_id]
    );
    return rows;
  },
    //ajouté pour le recap hebdomadaire de l'utilisateur 

  getWeeklySummaryByUser: async (user_id) => {
    if (!user_id) throw new Error("ID utilisateur manquant.");

    // Récapitulatif par catégorie et total global
    const [rows] = await pool.execute(
      `
      SELECT 
        SUM(montant) AS total_global,
        SUM(CASE WHEN categorie = 'sport' THEN montant ELSE 0 END) AS sport,
        SUM(CASE WHEN categorie = 'loisir' THEN montant ELSE 0 END) AS loisir,
        SUM(CASE WHEN categorie = 'alimentation' THEN montant ELSE 0 END) AS alimentation,
        SUM(CASE WHEN categorie = 'education' THEN montant ELSE 0 END) AS education,
        SUM(CASE WHEN categorie = 'sante' THEN montant ELSE 0 END) AS sante
      FROM depenses
      WHERE user_id = ?
        AND YEARWEEK(date_submission, 1) = YEARWEEK(CURDATE(), 1) - 1
      `,
      [user_id]
    );

    return rows[0]; // un seul objet avec le total global et par catégorie
  }



  
};

module.exports = Depense;