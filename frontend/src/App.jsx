import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css"
import "./tailwind.css"
import CreationPage from "./routes/creationPage";
import UserInfoCreation from './routes/userInfoCreation';

const App = () =>{
  console.log("✅ App component loaded!");

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<CreationPage />} />
        <Route path="/userInfoCreation" element={<UserInfoCreation />} />
      </Routes>
    </Router>
  );
}

export default App;