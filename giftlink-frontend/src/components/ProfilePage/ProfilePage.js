import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import { urlConfig } from '../../config';
import './ProfilePage.css';

function ProfilePage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const token = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    // Check authentication and load user data
    useEffect(() => {
        if (!token) {
            navigate('/app/login');
            return;
        }
        
        // Load user data from sessionStorage
        setFirstName(sessionStorage.getItem('firstName') || '');
        setLastName(sessionStorage.getItem('lastName') || '');
        setEmail(sessionStorage.getItem('userEmail') || '');
    }, [token, navigate]);

    // Handle profile update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const requestBody = {};
            if (firstName) requestBody.firstName = firstName;
            if (lastName) requestBody.lastName = lastName;
            if (email && email !== sessionStorage.getItem('userEmail')) {
                requestBody.email = email;
            }
            if (password) requestBody.password = password;

            const response = await fetch(`/api/auth/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'email': sessionStorage.getItem('userEmail') || email
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update session storage
                if (data.user) {
                    sessionStorage.setItem('firstName', data.user.firstName);
                    sessionStorage.setItem('lastName', data.user.lastName);
                    sessionStorage.setItem('userEmail', data.user.email);
                    setFirstName(data.user.firstName);
                    setLastName(data.user.lastName);
                    setEmail(data.user.email);
                }
                setMessage('Profile updated successfully!');
                setPassword('');
            } else {
                setError(data.error || data.message || 'Update failed');
            }
        } catch (err) {
            console.error('Update error:', err);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        sessionStorage.removeItem('bearer-token');
        sessionStorage.removeItem('firstName');
        sessionStorage.removeItem('lastName');
        sessionStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        navigate('/app');
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>My Profile</h2>
                
                {message && (
                    <div className="alert alert-success">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password <span className="text-muted">(leave blank to keep current)</span>
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter new password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="profile-actions">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfilePage;
