const pool = require("../config/database");

const User = {
async create(email, hashedPassword) {
  const [result] = await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword]
  );
  return result.insertId; 
},


  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  async updateProfile(id, { nom, prenom, age, salaire, epargne_vie, profession }) {
  await pool.query(
    "UPDATE users SET nom=?, prenom=?, age=?, salaire=?, epargne_vie=?, profession=? WHERE id=?",
    [nom, prenom, age, salaire, epargne_vie, profession, id]
  );
},

async findById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
},

updateSalaire: async (user_id, montant) => {
    const [result] = await pool.execute(
      `UPDATE users SET salaire = salaire - ? WHERE id = ?`,
      [montant, user_id]
    );
    return result;
  }
};




module.exports = User;
