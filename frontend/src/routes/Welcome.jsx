import React, { useRef, useEffect, useState, useMemo } from "react";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import 'dayjs/locale/fr'; // Pour les calculs de jours

dayjs.locale('fr');

// Fonction utilitaire pour capitaliser (déjà présente)
const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const WelcomePage = () => {
    const navigate = useNavigate();
    const statsRef = useRef(null);
    const filterRef = useRef(null);

    const [stats, setStats] = useState(null);
    const [allExpenses, setAllExpenses] = useState([]); // toutes les dépenses backend
    // userData.salaire contient le salaire RESTANT (d'après l'implémentation du contrôleur)
    const [userData, setUserData] = useState({ prenom: "name", salaire: 350 }); 
    const [loading, setLoading] = useState(true);

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
        santé: "Santé", 
        loisir_plural: "Loisir", 
    };

    // Fonction pour normaliser le montant en nombre
    const getNumericMontant = (raw) => {
        if (typeof raw === "string") {
            raw = raw.replace(",", ".").replace(/[^0-9.\-]/g, ""); 
        }
        const val = Number(raw);
        return isNaN(val) ? 0 : val;
    };


    // --- Calculs pour l'affichage filtré (EXISTANT) ---
    const filteredTotalNumber = allExpenses.length
        ? allExpenses
            .filter((exp) => {
                const backendCat = (exp.categorie || "").toString().trim().toLowerCase();
                const label = categoryMap[backendCat] || (backendCat ? capitalize(backendCat) : null);
                return label && selectedCategories[label];
            })
            .reduce((sum, exp) => sum + getNumericMontant(exp.montant), 0)
        : 0;

    const filteredTotal = filteredTotalNumber.toFixed(2);
    // ---------------------------------------------------


    // --- LOGIQUE DE L'ALERTE FRONTEND (NOUVEAU) ---

    // 1. Dépenses du mois en cours
    const currentMonthExpenses = useMemo(() => {
        const currentMonth = dayjs().month();
        const currentYear = dayjs().year();
        return allExpenses.filter(exp => {
            // Utiliser dayjs pour vérifier si la date de soumission est dans le mois/année actuel
            const expDate = dayjs(exp.date_submission);
            return expDate.month() === currentMonth && expDate.year() === currentYear;
        });
    }, [allExpenses]);

    // 2. Calcul du total dépensé ce mois-ci
    const totalDepenseMois = useMemo(() => {
        return currentMonthExpenses.reduce((sum, exp) => sum + getNumericMontant(exp.montant), 0);
    }, [currentMonthExpenses]);


    // 3. Calcul du Salaire Initial Estimé (Salaire Restant + Total Dépensé du mois)
    // NOTE: C'est l'hypothèse faite par le contrôleur backend, nous la réutilisons.
    const salaireRestant = getNumericMontant(userData.salaire); 
    const salaireInitialEstime = salaireRestant + totalDepenseMois;

    // 4. Calcul du pourcentage de dépense et état d'alerte
    const pourcentageDepense = salaireInitialEstime > 0 
        ? (totalDepenseMois / salaireInitialEstime) * 100 
        : 0;
    
    const isAlert = pourcentageDepense >= 80;
    const isOverSpent = salaireRestant <= 0; // Seuil supplémentaire : plus de salaire restant

    // 5. Calcul des dépenses journalières estimées (si alerte)
    const dailyExpenseEstimate = useMemo(() => {
        if (!isAlert || isOverSpent) return 0;

        const today = dayjs();
        // Calcule le dernier jour du mois
        const lastDayOfMonth = today.endOf('month');
        // Nombre de jours restants (inclut le jour actuel si on compte 1 pour aujourd'hui)
        // Jours restants = Différence en jours + 1 (si on inclut le jour actuel)
        const daysLeft = lastDayOfMonth.diff(today, 'day') + 1; 

        // Reste à dépenser = 20% du salaire initial (si on est à 80% pile) ou le reste non dépensé.
        // On va se baser sur le 20% restant pour être sûr de finir le mois.
        // Budget total pour le reste du mois = Salaire Initial - 80% du Salaire Initial
        
        // Ou plus simplement: Budget restant = Salaire Restant Actuel
        const budgetRestant = salaireRestant; 
        
        if (daysLeft > 0 && budgetRestant > 0) {
            return budgetRestant / daysLeft;
        }

        return 0;

    }, [isAlert, isOverSpent, salaireRestant]);


    // Le composant d'alerte
    const AlertBlock = () => {
        if (!isAlert && !isOverSpent) return null;
        
        let message = "";
        let style = "bg-yellow-100 border-yellow-500 text-yellow-700";
        let icon = "⚠️";

        if (isOverSpent) {
            style = "bg-red-100 border-red-500 text-red-700";
            icon = "🚨";
            message = `Oups ! Vous avez dépensé la totalité de votre salaire (${pourcentageDepense.toFixed(1)}%). Arrêtez les dépenses pour le reste du mois ! 😥`;
        } else if (isAlert) {
            style = "bg-yellow-100 border-yellow-500 text-yellow-700";
            icon = "⚠️";
            message = `Attention ! Vous avez dépensé ${pourcentageDepense.toFixed(1)}% de votre salaire estimé ce mois-ci. Pour finir le mois, votre budget journalier ne devrait pas dépasser :`;
        }

        return (
            <div className={`mt-8 mb-6 p-4 border-l-4 rounded-lg shadow-md max-w-xl mx-auto ${style}`}>
                <p className="font-bold flex items-center gap-2 text-lg">
                    {icon} Alerte Budget Mensuel
                </p>
                <p className="mt-2 text-base">
                    {message}
                    {isAlert && !isOverSpent && (
                        <span className="font-extrabold text-xl ml-2 block">
                            {dailyExpenseEstimate.toFixed(2)} €
                        </span>
                    )}
                </p>
            </div>
        );
    };

    // ---------------------------------------------


    // --- FETCHS (EXISTANT) ---

    // Charger l'utilisateur
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                // Endpoint pour récupérer le profil utilisateur (prénom, et le salaire RESTANT)
                const res = await fetch("http://localhost:3000/api/auth/me", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Non autorisé");

                const data = await res.json();
                // Assurez-vous que le champ `salaire` est correctement récupéré (il contient le salaire RESTANT)
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
                    { nom: "Sport", montant: getNumericMontant(data.sport) },
                    { nom: "Loisir", montant: getNumericMontant(data.loisir) },
                    { nom: "Alimentation", montant: getNumericMontant(data.alimentation) },
                    { nom: "Éducation", montant: getNumericMontant(data.education) },
                    { nom: "Santé", montant: getNumericMontant(data.sante) },
                ];

                setStats({ total: getNumericMontant(data.total_global), categories });
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    // Charger TOUTES les dépenses (pour le total filtré et les calculs du mois)
    useEffect(() => {
        const fetchAllExpenses = async () => {
            try {
                // Cet endpoint (/all) doit renvoyer TOUTES les dépenses de l'utilisateur
                const res = await fetch("http://localhost:3000/api/depenses/all", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Erreur récupération dépenses");

                const data = await res.json();
                setAllExpenses(Array.isArray(data) ? data : []); 
            } catch (err) {
                console.error("Erreur fetch all expenses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllExpenses();
    }, []);
    // ---------------------------------------------------


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
            <Navbar username={userData.prenom} salary={salaireRestant.toFixed(2)} /> 
            
            <div className="flex flex-1 w-full min-h-screen px-16 py-10">
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-darkColor leading-snug">
                        Bienvenue <span className="text-primary">{userData.prenom}</span> 👋 <br />
                        dans <span className="text-secondary">Suivi de dépenses</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Gardez un œil sur vos finances et optimisez vos dépenses au quotidien.
                    </p>
                    
                    {/* Bloc d'Alerte : Intégré ici pour un affichage proéminent */}
                    {!loading && <AlertBlock />}
                    {loading && <p className="mt-8 text-gray-500">Chargement des données...</p>}
                    
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
                            <span className="text-secondary text-2xl">{stats.total.toFixed(2)} €</span>
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
                                        <td className="p-3 text-gray-700">{cat.montant.toFixed(2)}</td>
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