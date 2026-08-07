import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    useEffect(() => {
        const fetchGifts = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/gifts`);
                const data = await response.json();
                setGifts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gifts:', error);
                setLoading(false);
            }
        };
        fetchGifts();
    }, []);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div><p>Loading gifts...</p></div>;

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Available Gifts</h1>
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 col-sm-6 mb-4">
                        <div className="card h-100" onClick={() => navigate(`/app/product/${gift.id}`)} style={{ cursor: 'pointer' }}>
                            <div className="card-body">
                                <h5 className="card-title">{gift.name}</h5>
                                <p className="card-text">
                                    <small>Posted: {formatDate(gift.date_added)}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;