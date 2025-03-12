const TOKEN = process.env.REACT_APP_TMDB_TOKEN;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${TOKEN}`
  }
};

export const searchMovies = async (query) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, options);
  const data = await response.json();
  return (data.results || []).map(x => ({
    ...x,
    "media_type": "movie"
  }));
};

export const searchTVShows = async (query) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}`, options);
  const data = await response.json();
  return (data.results || []).map(x => ({
    ...x,
    "media_type": "tv"
  }));
};

export const fetchCastAndCrew = async (id, type) => {
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits`, options);
  const data = await response.json();
  return {
    cast: data.cast ? data.cast.map(member => ({ 
      name: member.name, 
      character: member.character, 
      profile: member.profile_path,
      ...member 
    })) : [],
    crew: data.crew ? data.crew.map(member => ({ 
      name: member.name, 
      job: member.job,
      ...member
    })) : []
  };
};

export const fetchPersonDetails = async (personId) => {
  const response = await fetch(`https://api.themoviedb.org/3/person/${personId}?language=en-US`, options);
  return await response.json();
};

export const fetchPersonMovieCredits = async (personId) => {
  const response = await fetch(`https://api.themoviedb.org/3/person/${personId}/movie_credits?language=en-US`, options);
  return await response.json();
};

export const fetchPersonTVCredits = async (personId) => {
  const response = await fetch(`https://api.themoviedb.org/3/person/${personId}/tv_credits?language=en-US`, options);
  return await response.json();
};