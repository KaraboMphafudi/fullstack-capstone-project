import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Check login status from sessionStorage
        const token = sessionStorage.getItem('bearer-token');
        const name = sessionStorage.getItem('username');
        
        if (token && name) {
            setIsLoggedIn(true);
            setUsername(name);
        } else {
            setIsLoggedIn(false);
            setUsername('');
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('bearer-token');
        sessionStorage.removeItem('username');
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
                        {/* ✅ Conditional rendering based on login status */}
                        {isLoggedIn ? (
                            <>
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