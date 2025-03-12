import React from 'react';

const ResultsList = ({ id, results, onSelect, selectedId }) => {
  return (
    <div id={id} className="results-list d-flex flex-wrap">
      {results && results.map(item => (
        <div 
          key={`${item.media_type}-${item.id}`}
          className={`card m-2 p-2 ${selectedId === item.id ? 'selected' : ''}`}
          style={{ width: "150px", cursor: "pointer" }}
          onClick={() => onSelect(item)}
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
  );
};

export default ResultsList;