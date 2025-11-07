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
  }


  
};

module.exports = Depense;