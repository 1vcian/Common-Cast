import React, { useState, useEffect } from 'react';
import { searchMovies, searchTVShows } from '../services/api';

const SearchBar = ({ onResultSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTitles = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const movieResults = await searchMovies(query);
        const tvResults = await searchTVShows(query);
        
        // Combine and sort results by popularity and vote count
        const combinedResults = [...movieResults, ...tvResults].sort(
          (a, b) => b.vote_count * b.popularity - a.vote_count * a.popularity
        );
        
        setResults(combinedResults);
      } catch (error) {
        console.error('Error searching titles:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchTitles, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (item) => {
    onResultSelect({
      id: item.id,
      type: item.media_type,
      name: item.title || item.name,
      poster_path: item.poster_path
    });
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Cerca film o serie TV..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {loading && <div className="text-center">Caricamento...</div>}
      
      <div className="results-container d-flex flex-wrap">
        {results.map(item => (
          <div 
            key={`${item.media_type}-${item.id}`}
            className="card m-2 p-2"
            style={{ width: "150px", cursor: "pointer" }}
            onClick={() => handleSelect(item)}
          >
            <img 
              src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '/images/user.png'} 
              className="card-img-top" 
              alt={item.title || item.name}
            />
            <p className="text-center">{item.title || item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;