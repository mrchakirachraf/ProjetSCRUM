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
  }

  
};

module.exports = Depense;