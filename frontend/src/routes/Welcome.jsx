import React, { useRef, useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  const statsRef = useRef(null);

  const [stats, setStats] = useState(null);


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



  // 🔹 Récupération automatique des stats depuis ton backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/depenses/weekly-summary", {
          method: "GET",
          credentials: "include", // ⚠️ important pour les sessions
        });

        if (!res.ok) {
          throw new Error("Erreur lors du chargement des statistiques");
        }


        const data = await res.json();

        // ✅ Adapter le format pour ton tableau (tu veux un tableau de catégories)
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

  const scrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: "smooth" });
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
        className="bg-gray-50 w-full min-h-screen px-16 py-10 mt-10 border-t border-gray-200 flex flex-col justify-center gap-10"
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
                  <tr
                    key={i}
                    className="border-b hover:bg-gray-100 transition duration-200"
                  >
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
      </div>
    </div>
  );
};

export default WelcomePage;
