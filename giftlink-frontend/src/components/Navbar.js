import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = sessionStorage.getItem('bearer-token');
            const name = sessionStorage.getItem('firstName') || sessionStorage.getItem('username');
            
            console.log('🔍 Navbar - Token:', token);
            console.log('🔍 Navbar - Name:', name);
            
            if (token && name) {
                console.log('✅ User is logged in!');
                setIsLoggedIn(true);
                setUsername(name);
            } else {
                console.log('❌ User is NOT logged in');
                setIsLoggedIn(false);
                setUsername('');
            }
        };
        
        checkLoginStatus();
        
        // Listen for storage changes
        window.addEventListener('storage', checkLoginStatus);
        
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('bearer-token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('firstName');
        sessionStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        setUsername('');
        navigate('/app');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    🎁 GiftLink
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app">Gifts</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/app/search">Search</Link>
                        </li>
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/app/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link" style={{ color: '#fff' }}>
                                        Welcome, {username}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-outline-light" 
                                        onClick={handleLogout}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/app/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/app/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;