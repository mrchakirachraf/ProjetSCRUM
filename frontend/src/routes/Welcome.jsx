import React, { useRef, useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const filterRef = useRef(null);

  const [stats, setStats] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]); // toutes les dépenses backend
  const [userData, setUserData] = useState({ prenom: "name", salary: 350 });

  // Filtre catégories (labels affichés)
  const [selectedCategories, setSelectedCategories] = useState({
    Sport: true,
    Loisir: true,
    Alimentation: true,
    Éducation: true,
    Santé: true,
  });

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // map backend -> label affiché (gère casse/accents)
  const categoryMap = {
    sport: "Sport",
    loisir: "Loisir",
    alimentation: "Alimentation",
    education: "Éducation",
    sante: "Santé",
    santé: "Santé", // au cas où backend envoie avec accent
    loisir_plural: "Loisir", // exemple si besoin, tu peux adapter
  };

  // Calcul du total filtré : conversion des montants en Number + mapping des catégories
  const filteredTotalNumber = allExpenses.length
    ? allExpenses
        .filter((exp) => {
          const backendCat = (exp.categorie || "").toString().trim().toLowerCase();
          const label = categoryMap[backendCat] || (backendCat ? capitalize(backendCat) : null);
          return label && selectedCategories[label];
        })
        .reduce((sum, exp) => {
          // convertir en nombre proprement (remplacer virgule -> point si nécessaire)
          let raw = exp.montant;
          if (typeof raw === "string") {
            raw = raw.replace(",", ".").replace(/[^0-9.\-]/g, ""); // garde chiffres, point, signe -
          }
          const val = Number(raw);
          return sum + (isNaN(val) ? 0 : val);
        }, 0)
    : 0;

  // formaté pour affichage
  const filteredTotal = filteredTotalNumber.toFixed(2);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Charger l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Non autorisé");

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("Erreur profil :", err);
      }
    };

    fetchUser();
  }, []);

  // Charger Stats weekly pour le tableau du haut
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/depenses/weekly-summary", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erreur stats");

        const data = await res.json();

        const categories = [
          { nom: "Sport", montant: data.sport || 0 },
          { nom: "Loisir", montant: data.loisir || 0 },
          { nom: "Alimentation", montant: data.alimentation || 0 },
          { nom: "Éducation", montant: data.education || 0 },
          { nom: "Santé", montant: data.sante || 0 },
        ];

        setStats({ total: data.total_global || 0, categories });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  // Charger TOUTES les dépenses (pour le total filtré)
  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/depenses/all", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erreur récupération dépenses");

        const data = await res.json();
        setAllExpenses(Array.isArray(data) ? data : []); // sécurité : s'assurer que c'est un tableau
      } catch (err) {
        console.error("Erreur fetch all expenses:", err);
      }
    };

    fetchAllExpenses();
  }, []);

  const scrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToFilter = () => {
    filterRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const calculatePercentage = (montant) =>
    stats && stats.total > 0 ? ((montant / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-white w-full min-h-screen flex flex-col">
      <Navbar username={userData.prenom} salary={userData.salaire} />

      <div className="flex flex-1 w-full min-h-screen px-16 py-10">
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-darkColor leading-snug">
            Bienvenue <span className="text-primary">{userData.prenom}</span> 👋 <br />
            dans <span className="text-secondary">Suivi de dépenses</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Gardez un œil sur vos finances et optimisez vos dépenses au quotidien.
          </p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-96 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center mb-6">
            <img
              src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTcwdDZoOGplNjhkcDd2eXlzdzV2NmR2Z29lM200bThrdWU5aGNqdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1C9yO3HOCxv9qxAAFJ/giphy.gif"
              alt="finance gif"
              className="rounded-lg"
            />
          </div>

          <div className="flex flex-col justify-center gap-3">
            <button
              onClick={() => navigate("/ajouter")}
              className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-third transition duration-300"
            >
              ➕ Ajouter une dépense
            </button>
            <button
              onClick={scrollToStats}
              className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-third transition duration-300"
            >
              ⬇️ Afficher mes statistiques
            </button>
          </div>
        </div>
      </div>

      {/* Section Statistiques */}
      <div
        ref={statsRef}
        className="bg-white w-full min-h-screen px-16 py-10 mt-10 border-t border-gray-200 flex flex-col justify-center gap-10"
      >
        <h3 className="text-2xl font-semibold text-darkColor mb-6">
          Statistiques de la semaine précédente 📊
        </h3>

        {!stats ? (
          <p>Chargement des statistiques...</p>
        ) : (
          <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-4xl mx-auto">
            <p className="text-lg font-semibold text-gray-700 mb-4">
              💰 Dépenses totales :{" "}
              <span className="text-secondary text-2xl">{stats.total} €</span>
            </p>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary text-white text-center">
                  <th className="p-3 rounded-tl-lg">Catégorie</th>
                  <th className="p-3">Montant (€)</th>
                  <th className="p-3 rounded-tr-lg">Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                {stats.categories.map((cat, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100 transition duration-200">
                    <td className="p-3 font-medium text-gray-700">{cat.nom}</td>
                    <td className="p-3 text-gray-700">{cat.montant}</td>
                    <td className="p-3 text-gray-700">
                      {calculatePercentage(cat.montant)} %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            onClick={scrollToFilter}
            className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-third transition duration-300"
          >
            ⬇️ Voir plus
          </button>
        </div>
      </div>

      {/* SECTION FILTRE CATEGORIES */}
      {stats && (
        <div
          ref={filterRef}
          className="bg-white w-full min-h-screen px-16 py-10 mt-10 border-t border-gray-200 flex flex-col justify-center gap-10"
        >
          <div className="rounded-2xl shadow-md p-6 border border-gray-100 max-w-4xl mx-auto hover:shadow-lg transition">
            <h3 className="text-xl justify-center font-bold text-darkColor mb-4 flex items-center gap-2">
              Total de mes dépenses sur <span className="text-secondary text-2xl">Suivi de dépenses</span>
            </h3>

            <div className="flex flex-wrap justify-center gap-5">
              {Object.keys(selectedCategories).map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border hover:bg-gray-100 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    style={{ accentColor: "#50589C" }}
                    className="w-4 h-4"
                    checked={selectedCategories[cat]}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span className="text-gray-700 font-medium">{cat}</span>
                </label>
              ))}
            </div>

            <p className="mt-5 text-lg font-semibold text-gray-700">
              Total filtré :{" "}
              <span className="text-secondary text-2xl">{filteredTotal} €</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
