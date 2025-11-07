import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const UserInfoCreation = () => {
  const [formData, setFormData] = useState({
    nom: "", // Changé de "name" à "nom"
    prenom: "",
    age: "",
    salaire: "",
    epargne_vie: "",
    profession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/user/infoUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        alert("Informations enregistrées avec succès ✅");
        navigate("/welcome");
      } else {
        alert("Erreur : " + data.error);
      }
    } catch (err) {
      alert("Erreur : " + err);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-50 shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-[#3C467B] mb-6 text-center">
          Informations Utilisateur
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Changé name="name" en name="nom" */}
          <input
            type="text"
            name="nom" // ICI : changé de "name" à "nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Nom"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
          />

          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
          />

          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Âge"
            required
            min="1"
            step="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
          />

          <input
            type="number"
            name="salaire"
            value={formData.salaire}
            onChange={handleChange}
            placeholder="Salaire"
            required
            min="0.01"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
          />

          <input
            type="number"
            name="epargne_vie"
            value={formData.epargne_vie}
            onChange={handleChange}
            placeholder="Épargne Vie"
            required
            min="0.00"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
          />

          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="Profession"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300 bg-[#50589C] hover:bg-[#636CCB]"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfoCreation;