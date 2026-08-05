import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
//import { urlConfig } from '../../config';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [incorrect, setIncorrect] = useState('');
    
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    // If user already logged in, redirect to MainPage
    useEffect(() => {
        if (sessionStorage.getItem('bearer-token')) {
            navigate('/app');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIncorrect('');
        setLoading(true);

        // Validate inputs
        if (!email || !password) {
            setIncorrect('Email and password are required');
            setLoading(false);
            return;
        }

        try {
            // ✅ Using proxy URL
            const response = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Store authentication token and user details
                if (data.authtoken) {
                    sessionStorage.setItem('bearer-token', data.authtoken);
                    setIsLoggedIn(true);
                }
                if (data.userName) {
                    sessionStorage.setItem('username', data.userName);
                    sessionStorage.setItem('firstName', data.userName);
                }
                if (data.userEmail) {
                    sessionStorage.setItem('userEmail', data.userEmail);
                }

                // ✅ Force storage event to trigger Navbar update
                window.dispatchEvent(new Event('storage'));

                // Navigate to MainPage on successful login
                navigate('/app');
            } else {
                // Display error message from backend
                setIncorrect(data.error || data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setIncorrect('Failed to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-wrapper">
                <h2>Login</h2>
                
                {/* Display error message */}
                {incorrect && (
                    <div className="alert alert-danger" role="alert">
                        {incorrect}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-3 text-center">
                    <p>
                        Don't have an account?{' '}
                        <a href="/app/register" className="text-primary">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;