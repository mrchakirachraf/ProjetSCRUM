import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ salary, username }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Exemple de logout via backend Express
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  return (
    <nav className="w-full fixed bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Titre à gauche */}
      <button onClick={() => navigate("/welcome")} className="border-0 outline-none active:border-0 ">
        <h1 className="text-xl font-bold text-primary">
          Suivi de dépenses
        </h1>
      </button>

      {/* Infos utilisateur */}
      <div className="flex items-center gap-6">
        <span className="text-darkColor font-medium">Solde : {salary} €</span>

        {/* Menu utilisateur */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-white rounded-lg hover:bg-third transition"
          >
            {username} ▾
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => navigate("/history")}
                className="block w-full text-black text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Historique
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
