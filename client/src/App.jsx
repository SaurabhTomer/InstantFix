import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import BookService from "./pages/BookService";
import UserDashboard from "./components/dashboard/UserDashboard";
import ElectricianDashboard from "./components/dashboard/ElectricianDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/dashboard/user/*" element={<UserDashboard />} />
        <Route path="/dashboard/electrician/*" element={<ElectricianDashboard />} />
        <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;