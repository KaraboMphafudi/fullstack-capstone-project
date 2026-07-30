// src/components/SearchPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

// Use environment variable or fallback to the server IP


const SearchPage = () => {
  const navigate = useNavigate();
  
  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    condition: '',
    age: ''
  });
  
  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Categories for dropdown
  const categories = [
    'All Categories',
    'Electronics',
    'Furniture',
    'Books',
    'Clothing',
    'Sports',
    'Toys',
    'Garden',
    'Kitchen',
    'Other'
  ];
  
  // Conditions for dropdown
  const conditions = [
    'Any Condition',
    'New',
    'Like New',
    'Good',
    'Fair',
    'Poor'
  ];
  
  // Age options for dropdown
  const ageOptions = [
    'Any Age',
    '0-1 year',
    '1-2 years',
    '2-5 years',
    '5-10 years',
    '10+ years'
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Build query string from search parameters
      const queryParams = new URLSearchParams();
      
      if (searchParams.keyword) queryParams.append('name', searchParams.keyword);
      if (searchParams.category && searchParams.category !== 'All Categories') {
        queryParams.append('category', searchParams.category);
      }
      if (searchParams.condition && searchParams.condition !== 'Any Condition') {
        queryParams.append('condition', searchParams.condition);
      }
      if (searchParams.age && searchParams.age !== 'Any Age') {
        // Convert age string to number (e.g., "1-2 years" -> 2)
        const ageMatch = searchParams.age.match(/(\d+)/);
        if (ageMatch) {
          queryParams.append('age_years', parseInt(ageMatch[0]));
        }
      }
      
      // Make API call to backend search endpoint
      const response = await fetch(`/api/search?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      
      const data = await response.json();
      setSearchResults(data);
      
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear search and reset results
  const handleClearSearch = () => {
    setSearchParams({
      keyword: '',
      category: '',
      condition: '',
      age: ''
    });
    setSearchResults([]);
    setError('');
  };

  // Navigate to item details page
  const handleItemClick = (itemId) => {
    navigate(`/app/product/${itemId}`);
  };

  return (
    <div className="search-page-container">
      <h1 className="search-title">Search Gifts</h1>
      
      {/* Search Form */}
      <div className="search-form-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-row">
            <div className="form-group">
              <input
                type="text"
                name="keyword"
                placeholder="Search by keyword..."
                value={searchParams.keyword}
                onChange={handleInputChange}
                className="search-input"
              />
            </div>
            
            <div className="form-group">
              <select
                name="category"
                value={searchParams.category}
                onChange={handleInputChange}
                className="search-select"
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="search-row">
            <div className="form-group">
              <select
                name="condition"
                value={searchParams.condition}
                onChange={handleInputChange}
                className="search-select"
              >
                {conditions.map((cond, index) => (
                  <option key={index} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <select
                name="age"
                value={searchParams.age}
                onChange={handleInputChange}
                className="search-select"
              >
                {ageOptions.map((age, index) => (
                  <option key={index} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="search-actions">
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button type="button" onClick={handleClearSearch} className="clear-button">
              Clear
            </button>
          </div>
        </form>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Search Results */}
      <div className="search-results">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading results...</p>
          </div>
        ) : (
          <>
            {searchResults.length > 0 ? (
              <>
                <p className="results-count">
                  Found {searchResults.length} item{searchResults.length > 1 ? 's' : ''}
                </p>
                <div className="results-grid">
                  {searchResults.map((item) => (
                    <div 
                      key={item._id || item.id} 
                      className="result-card"
                      onClick={() => handleItemClick(item._id || item.id)}
                    >
                      <div className="result-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name || item.title} />
                        ) : (
                          <div className="placeholder-image">No Image</div>
                        )}
                      </div>
                      <div className="result-details">
                        <h3 className="result-title">{item.name || item.title}</h3>
                        <span className="result-category">{item.category}</span>
                        <p className="result-condition">Condition: {item.condition}</p>
                        {item.age_years && (
                          <p className="result-age">Age: {item.age_years} years</p>
                        )}
                        <p className="result-description">
                          {item.description && item.description.length > 100 
                            ? `${item.description.substring(0, 100)}...` 
                            : item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              !loading && searchParams.keyword && (
                <div className="no-results">
                  <p>No items found matching your search criteria.</p>
                  <p>Try adjusting your search terms or filters.</p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;