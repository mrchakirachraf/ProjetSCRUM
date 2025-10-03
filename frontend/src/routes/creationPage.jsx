import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreationPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        const res2 = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const passData = await res2.json();
        if(passData.password){
            alert(passData.message + " : " + passData.password);
            navigate("/userInfoCreation");
        }else{
            alert(passData.error);

        }
    } catch (err) {
      alert("Erreur : " + err);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="bg-gray-50 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#3C467B] mb-6 text-center">
          Inscription
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#636CCB]"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300 bg-[#50589C] hover:bg-[#636CCB]"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreationPage;