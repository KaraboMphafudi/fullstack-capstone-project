import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';

function DetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([
        { id: 1, username: 'JohnDoe', text: 'This looks amazing!', date: '2024-01-15' },
        { id: 2, username: 'JaneSmith', text: 'Is this still available?', date: '2024-01-16' }
    ]);
    const [newComment, setNewComment] = useState('');

    // Task 1: Check for authentication
    const token = localStorage.getItem('token');
    const isLoggedIn = true;

    useEffect(() => {
        // Task 3: Scroll to top
        window.scrollTo(0, 0);

        // Task 2: Fetch gift details
        const fetchGiftDetails = async () => {
            // Redirect if not logged in (Task 1)
            if (!isLoggedIn) {
                navigate('/app/login');
                return;
            }

            try {
                const response = await fetch(`https://karaboekfm-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/api/gifts/${productId}`);
                
                if (!response.ok) {
                    throw new Error('Gift not found');
                }
                
                const data = await response.json();
                setGift(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gift details:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchGiftDetails();
    }, [productId, isLoggedIn, navigate]);

    // Format date function
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Date not available';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Get condition badge class
    const getConditionClass = (condition) => {
        switch (condition) {
            case 'New': return 'badge-new';
            case 'Used': return 'badge-used';
            case 'Older': return 'badge-older';
            default: return 'badge-default';
        }
    };

    // Task 4: Handle back click
    const handleBack = () => {
        navigate(-1);
    };

    // Handle express interest
    const handleExpressInterest = () => {
        if (!isLoggedIn) {
            alert('Please login to express interest in this gift');
            navigate('/app/login');
            return;
        }
        alert(`Thank you for your interest in "${gift.name}"! The gift giver will be notified.`);
    };

    // Task 7: Handle comment submission
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        if (!isLoggedIn) {
            alert('Please login to comment');
            navigate('/app/login');
            return;
        }

        const comment = {
            id: Date.now(),
            username: JSON.parse(localStorage.getItem('user'))?.firstName || 'Anonymous',
            text: newComment,
            date: new Date().toISOString()
        };
        setComments([...comments, comment]);
        setNewComment('');
    };

    // Task 7: Render comments section
    const renderComments = () => {
        if (comments.length === 0) {
            return (
                <div className="no-comments">
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            );
        }

        return comments.map((comment, index) => (
            <div key={comment.id || index} className="comment-item">
                <div className="comment-header">
                    <strong>{comment.username}</strong>
                    <span className="comment-date">
                        {new Date(comment.date).toLocaleDateString()}
                    </span>
                </div>
                <p className="comment-text">{comment.text}</p>
            </div>
        ));
    };

    // Loading state
    if (loading) {
        return (
            <div className="details-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading gift details...</p>
            </div>
        );
    }

    // Task 7: Error handling
    if (error || !gift) {
        return (
            <div className="details-error">
                <h3>Gift Not Found</h3>
                <p>We couldn't find the gift you're looking for.</p>
                <button className="btn btn-primary" onClick={handleBack}>
                    Back to Gifts
                </button>
            </div>
        );
    }

    // Task 5 & 6: Display gift details
    return (
        <div className="details-page container mt-4">
            {/* Task 4: Back button */}
            <button className="btn btn-secondary back-button" onClick={handleBack}>
                ← Back to Gifts
            </button>

            <div className="details-card">
                {/* Task 5: Display gift image */}
                <div className="image-placeholder-large">
                    {gift.image ? (
                        <img
                            src={gift.image}
                            alt={gift.name}
                            className="product-image-large"
                        />
                    ) : (
                        <div className="no-image-available-large">
                            <span>📦</span>
                            <p>No Image Available</p>
                        </div>
                    )}
                </div>

                <div className="details-content">
                    {/* Task 6: Display gift name */}
                    <h1 className="details-title">{gift.name}</h1>

                    {/* Task 6: Display gift details */}
                    <div className="details-meta">
                        <span className={`details-badge ${getConditionClass(gift.condition)}`}>
                            {gift.condition || 'N/A'}
                        </span>
                        <span className="details-badge details-category">
                            {gift.category || 'Uncategorized'}
                        </span>
                        <span className={`status-badge ${gift.status === 'Available' ? 'status-available' : 'status-taken'}`}>
                            {gift.status || 'Available'}
                        </span>
                    </div>

                    <div className="details-info">
                        <p><strong>Posted:</strong> {formatDate(gift.date_added)}</p>
                        <p><strong>Age:</strong> {gift.age_years || 'N/A'} years</p>
                        <p><strong>Location:</strong> {gift.zipcode || 'Not specified'}</p>
                        <p><strong>Contact:</strong> {gift.contactInfo || 'Not provided'}</p>
                    </div>

                    <div className="details-description">
                        <h4>Description</h4>
                        <p>{gift.description || 'No description available.'}</p>
                    </div>

                    <div className="details-actions">
                        <button
                            className="btn btn-primary btn-interest"
                            onClick={handleExpressInterest}
                        >
                            Express Interest
                        </button>
                    </div>

                    {/* Task 7: Comments Section */}
                    <div className="comments-section">
                        <h4>Comments</h4>
                        {renderComments()}
                        
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                                className="form-control"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows="3"
                            />
                            <button type="submit" className="btn btn-primary mt-2">
                                Post Comment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;
