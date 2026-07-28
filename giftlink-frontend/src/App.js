import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import Navbar from './components/Navbar';
import RegisterPage from './components/RegisterPage/RegisterPage';
import LoginPage from './components/LoginPage/LoginPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/app" element={<MainPage />} />
                    <Route path="/app/login" element={<LoginPage />} />
                    <Route path="/app/register" element={<RegisterPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;