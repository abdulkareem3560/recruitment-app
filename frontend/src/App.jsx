import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import CreateEditRecord from "./components/CreateEditRecord";

function App() {

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    .thin-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: #b3c6e9 #e0e7ff;
    }
    .thin-scrollbar::-webkit-scrollbar {
      width: 7px;
      border-radius: 8px;
    }
    .thin-scrollbar::-webkit-scrollbar-thumb {
      border-radius: 8px;
      min-height: 40px;
    }
    .thin-scrollbar::-webkit-scrollbar-thumb:hover {
    }
  `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/create-edit" element={<CreateEditRecord/>}/>
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
