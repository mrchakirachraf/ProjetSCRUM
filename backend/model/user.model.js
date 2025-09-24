const pool = require("../config/database");

const User = {
async create(email, hashedPassword) {
  const [result] = await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword]
  );
  return result.insertId; // ⚠️ important sinon userId sera undefined
},


  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  async updateProfile(id, { nom, prenom, age, salaire, epargne_vie }) {
  await pool.query(
    "UPDATE users SET nom=?, prenom=?, age=?, salaire=?, epargne_vie=? WHERE id=?",
    [nom, prenom, age, salaire, epargne_vie, id]
  );
}

};

module.exports = User;
