import React, { useState } from 'react';
import { searchMovies, searchTVShows } from '../services/api';
import CastComparison from './CastComparison';
import ActorModal from './ActorModal';

const ComparisonPage = () => {
  const [title1, setTitle1] = useState('');
  const [title2, setTitle2] = useState('');
  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [selectedTitle1, setSelectedTitle1] = useState(null);
  const [selectedTitle2, setSelectedTitle2] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const searchTitles = async (query, resultSet) => {
    if (!query.trim()) {
      if (resultSet === 1) setResults1([]);
      else setResults2([]);
      return;
    }

    if (resultSet === 1) setLoading1(true);
    else setLoading2(true);

    try {
      const movieResults = await searchMovies(query);
      const tvResults = await searchTVShows(query);
      
      // Combine and sort results
      const combinedResults = [...movieResults, ...tvResults].sort(
        (a, b) => b.vote_count * b.popularity - a.vote_count * a.popularity
      );
      
      if (resultSet === 1) setResults1(combinedResults);
      else setResults2(combinedResults);
    } catch (error) {
      console.error('Error searching titles:', error);
    } finally {
      if (resultSet === 1) setLoading1(false);
      else setLoading2(false);
    }
  };

  const handleTitleSelect = (item, resultSet) => {
    if (resultSet === 1) {
      setSelectedTitle1({
        id: item.id,
        type: item.media_type,
        name: item.title || item.name,
        poster_path: item.poster_path
      });
    } else {
      setSelectedTitle2({
        id: item.id,
        type: item.media_type,
        name: item.title || item.name,
        poster_path: item.poster_path
      });
    }
  };

  const handleActorSelect = (actor) => {
    setSelectedActor(actor);
    setShowModal(true);
  };

  const handleCompare = () => {
    if (!selectedTitle1 || !selectedTitle2) {
      alert("Seleziona entrambi i titoli per il confronto.");
      return;
    }
    setComparisonResults({ title1: selectedTitle1, title2: selectedTitle2 });
  };

  return (
    <div className="container">
      <h2 className="text-center">Confronto Cast Film/Serie TV</h2>
      <div className="d-flex justify-content-between">
        <div className="half">
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Titolo del primo Film/Serie TV"
            value={title1}
            onChange={(e) => {
              setTitle1(e.target.value);
              searchTitles(e.target.value, 1);
            }}
          />
          <div id="results1" className="d-flex flex-wrap scrollable p-5">
            {loading1 ? (
              <div className="text-center w-100">Caricamento...</div>
            ) : (
              results1.map(item => (
                <div 
                  key={`${item.media_type}-${item.id}`}
                  className={`card m-2 p-2 ${selectedTitle1 && selectedTitle1.id === item.id ? 'selected' : ''}`}
                  style={{ width: "150px", cursor: "pointer" }}
                  onClick={() => handleTitleSelect(item, 1)}
                >
                  <img 
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '/images/user.png'} 
                    className="card-img-top" 
                    alt={item.title || item.name}
                  />
                  <p className="text-center">{item.title || item.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="half">
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Titolo del secondo Film/Serie TV"
            value={title2}
            onChange={(e) => {
              setTitle2(e.target.value);
              searchTitles(e.target.value, 2);
            }}
          />
          <div id="results2" className="d-flex flex-wrap scrollable p-5">
            {loading2 ? (
              <div className="text-center w-100">Caricamento...</div>
            ) : (
              results2.map(item => (
                <div 
                  key={`${item.media_type}-${item.id}`}
                  className={`card m-2 p-2 ${selectedTitle2 && selectedTitle2.id === item.id ? 'selected' : ''}`}
                  style={{ width: "150px", cursor: "pointer" }}
                  onClick={() => handleTitleSelect(item, 2)}
                >
                  <img 
                    src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : '/images/user.png'} 
                    className="card-img-top" 
                    alt={item.title || item.name}
                  />
                  <p className="text-center">{item.title || item.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <button type="button" className="btn" onClick={handleCompare} disabled={!selectedTitle1 || !selectedTitle2}>
        <strong>Confronta</strong>
        <div className="container-stars">
          <div className="stars"></div>
        </div>
        <div className="glow">
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </button>
      
      <div id="comparisonResults" className="mt-4">
        {comparisonResults && (
          <CastComparison 
            title1={comparisonResults.title1} 
            title2={comparisonResults.title2} 
            onActorSelect={handleActorSelect}
          />
        )}
      </div>
      
      {showModal && selectedActor && (
        <ActorModal actor={selectedActor} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default ComparisonPage;