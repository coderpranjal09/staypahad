import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HomestayDetails from './pages/HomestayDetails';
import SearchResults from './pages/SearchResults';
import OwnerRoutes from './owner/OwnerRoutes';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './admin/ProtectedRoute';
import './App.css';
import Login from './admin/Login';
import AdminDashboard from './admin/AdminDashboard';
import SearchBar from './components/SearchBar';
import LoginRoute from './pages/LoginRoute';
import ContactPage from './components/ContactPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/homestay/:id" element={<HomestayDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/owner/*" element={<OwnerRoutes />} />
             <Route path="/login" element={<Login />} />
             <Route path="/search" element={<SearchBar/>}/>
             <Route path="/profile" element ={<LoginRoute/>}/>
              <Route path="/contact" element ={<ContactPage/>}/>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      
            {/* Add other routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;