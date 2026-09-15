import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurpriseHome from './pages/SurpriseHome';
import AdminDashboard from './pages/AdminDashboard';
import './styles/style.css';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<SurpriseHome />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
