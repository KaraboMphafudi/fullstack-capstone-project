import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './components/MainPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/app/main" element={<MainPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
