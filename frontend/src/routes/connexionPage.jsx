import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ConnexionPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" }); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ⬅️ important pour envoyer/recevoir le cookie de session
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setFeedback({ type: "success", message: data.message || "Connexion réussie !" });
        // Redirection après succès
        setTimeout(() => navigate("/welcome"), 1000);
      } else {
        setFeedback({ type: "error", message: data.error || "Échec de la connexion" });
      }
    } catch (err) {
      setLoading(false);
      setFeedback({ type: "error", message: "Erreur réseau : " + err.message });
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-50 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-primary mb-4 text-center">Connexion</h1>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Connectez-vous pour accéder à la plateforme
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ email */}
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="Votre email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third"
          />

          {/* Champ mot de passe */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-third pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary"
            >
              {showPassword ? "Cacher" : "Afficher"}
            </button>
          </div>

          {/* Feedback */}
          {feedback.message && (
            <div
              className={`text-sm px-4 py-3 rounded ${
                feedback.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-secondary hover:bg-third"}`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Pas encore de compte ?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-semibold text-primary underline"
          >
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
};

export default ConnexionPage;
