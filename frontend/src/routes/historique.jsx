import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";


const HistoriquePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categorie] = useState([
    "toutes",
    "loisirs",
    "sport",
    "sante",
    "education",
    "alimentation",
  ]);

  const [filters, setFilters] = useState({
    categorie: "toutes",
    startDate: "",
    endDate: "",
  });

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

        setUserData(data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      }
    };


    fetchUser();
  }, []);


  // 🔹 Charger les dépenses depuis le backend
  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/depenses/all", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      // 🔹 Filtrage côté frontend si besoin
      let filtered = data;
      if (filters.categorie && filters.categorie !== "toutes") {
        filtered = filtered.filter(
          (dep) => dep.categorie === filters.categorie
        );
      }
      if (filters.startDate) {
        filtered = filtered.filter(
          (dep) => new Date(dep.date_submission) >= new Date(filters.startDate)
        );
      }
      if (filters.endDate) {
        filtered = filtered.filter(
          (dep) => new Date(dep.date_submission) <= new Date(filters.endDate)
        );
      }

      setExpenses(filtered);
    } catch (err) {
      console.error("Erreur lors de la récupération :", err);
    }
  };

  // 🔹 Charger au montage et quand filtres changent
  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  // 🔹 Gérer changement filtre
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar username={userData.prenom} salary={userData.salaire} />


      <div className="px-8 pt-32">

        <h2 className="text-3xl font-bold text-darkColor mb-6">
          📜 Historique de mes dépenses
        </h2>

        {/* 🔍 Zone de filtres */}
        <div className="bg-gray-50 shadow-md rounded-xl p-6 flex flex-wrap items-end gap-4 mb-8">
          {/* Filtre catégorie */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-darkColor mb-2">
              Catégorie
            </label>
            <select
              name="categorie"
              value={filters.categorie}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
            >
              {categorie.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre date début */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-darkColor mb-2">
              Date de début
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
            />
          </div>

          {/* Filtre date fin */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-darkColor mb-2">
              Date de fin
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
            />
          </div>

          {/* Bouton reset */}
          <button
            onClick={() =>
              setFilters({ categorie: "toutes", startDate: "", endDate: "" })
            }
            className="px-6 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-third transition"
          >
            Réinitialiser
          </button>
        </div>

        {/* 🧾 Tableau des dépenses */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-secondary text-white">
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Catégorie</th>
                <th className="p-3 text-left">Montant (€)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((exp, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition duration-200"
                  >
                    <td className="p-3 text-gray-700">
                      {new Date(exp.date_submission).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-3 text-gray-700">{exp.nom}</td>
                    <td className="p-3 text-gray-700">
                      {exp.description || "-"}
                    </td>
                    <td className="p-3 text-gray-700 capitalize">
                      {exp.categorie}
                    </td>
                    <td className="p-3 text-gray-700 font-semibold">
                      {exp.montant} €
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 italic"
                  >
                    Aucune dépense trouvée pour ces filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoriquePage;
