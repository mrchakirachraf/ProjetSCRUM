import React, { useState , useEffect } from "react";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";


const ajouterDepensePage = () => {
  const navigate = useNavigate();

  // Exemple : ces infos viennent de la session/backend
  const [userData, setUserData] = useState({prenom : "name", salary : 350});


  useEffect(() => {
    // 🔥 Appel à /api/auth/me pour récupérer les infos utilisateur
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          credentials: "include", // important pour envoyer le cookie de session
        });

        if (!res.ok) throw new Error("Non autorisé");

        const data = await res.json();

        console.log(res.ok)

        setUserData(data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      }
    };


    fetchUser();
  }, []);


  // États du formulaire
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [montant, setMontant] = useState("");
  const [categorie, setCategorie] = useState("");

  // Date du jour en français
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Gestion de l’enregistrement
  const handleSave = async (e, stayOnPage = false) => {
    e.preventDefault();
    if (montant <= 0) {
        alert("Le montant doit être supérieur à 0 !");
        return;
      }
    const expenseData = { nom, description, montant, categorie };


    try {
      const res = await fetch("http://localhost:3000/api/depenses/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        if (stayOnPage) {
          // Réinitialise le formulaire
          setNom("");
          setDescription("");
          setMontant("");
          setCategorie("Loisirs");
          alert("Dépense enregistrée, vous pouvez en ajouter une autre !");
        } else {
          navigate("/welcome");
        }
      } else {
        alert("Erreur lors de l'enregistrement : " + data.error);
      }
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar username={userData.prenom} salary={userData.salaire} />

      {/* Contenu */}
      <div className="flex flex-col items-center px-6 py-10">
        {/* Date */}
        <h2 className="text-xl font-semibold text-darkColor mb-8">
          {today}
        </h2>

        {/* Formulaire */}
        <form
          onSubmit={(e) => handleSave(e, false)}
          className="bg-gray-50 shadow-lg rounded-xl p-8 w-full max-w-lg space-y-6"
        >
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-darkColor mb-2">
              Nom
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-darkColor mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
            />
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-darkColor mb-2">
              Montant (€)
            </label>
            <input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
              min="0.01"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-darkColor mb-2">
              Catégorie
            </label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
              
              required // ← This makes the field required in HTML5
            >
              <option value="">Sélectionnez une catégorie</option> {/* ← Blank/default option */}
              <option value="loisirs">Loisirs</option>
              <option value="sport">Sport</option>
              <option value="santé">Santé</option>
              <option value="éducation">Éducation</option>
              <option value="alimentation">Alimentation</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-between items-center gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-third transition"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={(e) => handleSave(e, true)}
              className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-third transition"
            >
              Ajouter une autre
            </button>
            <button
              type="button"
              onClick={() => navigate("/welcome")}
              className="flex-1 px-6 py-3 bg-gray-300 text-darkColor font-semibold rounded-lg shadow-md hover:bg-gray-400 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ajouterDepensePage;