import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchPersonDetails, fetchPersonMovieCredits, fetchPersonTVCredits } from '../services/api';
import { formatDate } from '../utils/helpers';

const ActorModal = ({ actor, onClose }) => {
  const [actorDetails, setActorDetails] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!actor || !actor.id) return;
      
      setLoading(true);
      try {
        // Fetch actor details
        const details = await fetchPersonDetails(actor.id);
        setActorDetails(details);
        
        // Fetch movie and TV credits
        const movieCredits = await fetchPersonMovieCredits(actor.id);
        const tvCredits = await fetchPersonTVCredits(actor.id);
        
        // Combine and sort by popularity
        const combinedCredits = [
          ...(movieCredits.cast || []), 
          ...(tvCredits.cast || [])
        ].sort((a, b) => b.vote_count * b.popularity - a.vote_count * a.popularity);
        
        setMovies(combinedCredits);
      } catch (err) {
        console.error('Error fetching actor data:', err);
        setError('Impossibile caricare i dettagli dell\'attore.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [actor]);

  if (!actor) return null;

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{actorDetails?.name || "Dettagli Attore"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">Caricamento...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="row">
            <div className="col-md-4">
              <img 
                id="actorImage" 
                src={actorDetails?.profile_path ? `https://image.tmdb.org/t/p/w200${actorDetails.profile_path}` : '/images/user.png'} 
                className="img-fluid" 
                alt={actorDetails?.name}
              />
              <p id="actorGender">Sesso: {actorDetails?.gender === 2 ? "Maschio" : actorDetails?.gender === 1 ? "Femmina" : "Non specificato"}</p>
              <p id="actorBirthdate">Nato il: {formatDate(actorDetails?.birthday)}</p>
              <p id="actorPlaceOfBirth">Luogo di nascita: {actorDetails?.place_of_birth || "Non specificato"}</p>
              <p id="actorAlsoKnownAs">Conosciuto anche come: {actorDetails?.also_known_as?.join(', ') || "Non specificato"}</p>
            </div>
            <div className="col-md-8">
              <h4>Biografia</h4>
              <p id="actorBiography">{actorDetails?.biography || "Nessuna biografia disponibile."}</p>
              
              <h4>Filmografia</h4>
              <div id="actorMovies" className="d-flex flex-wrap" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {movies.map(movie => (
                  <div key={`${movie.id}-${movie.media_type || 'movie'}`} className="movie-item card m-1 p-2" style={{ width: '150px' }}>
                    <img 
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '/images/user.png'} 
                      alt={movie.title || movie.name}
                      className="card-img-top"
                    />
                    <span className="infoAct">
                      <h5>{movie.title || movie.name}</h5>
                      <p>Ruolo:</p>
                      <p>{movie.character}</p>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
       
        <button type="button"  onClick={onClose} className="btn">
        <strong>Chiudi</strong>
        <div className="container-stars">
          <div className="stars"></div>
        </div>
        <div className="glow">
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ActorModal;