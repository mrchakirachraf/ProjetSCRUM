import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css"
import "./tailwind.css"
import CreationPage from "./routes/creationPage";
import UserInfoCreation from './routes/userInfoCreation';
import ConnexionPage from './routes/connexionPage';
import AjouterDepensePage from './routes/ajouterDepensePage';


const App = () =>{
  console.log("✅ App component loaded!");

  return (
    <Router>
      <Routes>
        <Route path="" element={<ConnexionPage />} />
        <Route path="/register" element={<CreationPage />} />
        <Route path="/userInfoCreation" element={<UserInfoCreation />} />
        <Route path="/ajouter" element={<AjouterDepensePage />} />
      </Routes>
    </Router>
  );
}

export default App;