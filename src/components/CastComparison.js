import React, { useState, useEffect } from 'react';
import { fetchCastAndCrew } from '../services/api';

const CastComparison = ({ title1, title2, onActorSelect }) => {
  const [commonCast, setCommonCast] = useState([]);
  const [uniqueCast, setUniqueCast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const compareCasts = async () => {
      if (!title1 || !title2) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data1 = await fetchCastAndCrew(title1.id, title1.type);
        const data2 = await fetchCastAndCrew(title2.id, title2.type);
        
        // Create maps for cast names
        const cast1Names = new Map(data1.cast.map(c => [c.name, {
          ...c,
          "show1": title1.name
        }]));
        
        const cast2Names = new Map(data2.cast.map(c => [c.name, {
          ...c,
          "show2": title2.name
        }]));
        
        // Find common cast members
        const common = [];
        for (const [name, member1] of cast1Names) {
          if (cast2Names.has(name)) {
            const member2 = cast2Names.get(name);
            common.push({
              show1: title1.name,
              show2: title2.name,
              id: member1.id || member2.id,
              name: name,
              character1: member1.character,
              character2: member2.character,
              profile: member1.profile_path || member2.profile_path
            });
          }
        }
        
        // Find unique cast members
        const unique1 = Array.from(cast1Names.values()).filter(c => !cast2Names.has(c.name));
        const unique2 = Array.from(cast2Names.values()).filter(c => !cast1Names.has(c.name));
        
        // Sort alphabetically
        common.sort((a, b) => a.name.localeCompare(b.name));
        const uniqueAll = [...unique1, ...unique2].sort((a, b) => a.name.localeCompare(b.name));
        
        setCommonCast(common);
        setUniqueCast(uniqueAll);
      } catch (err) {
        console.error("Error comparing casts:", err);
        setError("Si è verificato un errore durante il confronto dei cast.");
      } finally {
        setLoading(false);
      }
    };
    
    compareCasts();
  }, [title1, title2]);

  if (loading) return <div className="text-center mt-4">Caricamento confronto cast...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  
  const allMembers = [...commonCast, ...uniqueCast];
  console.log(allMembers)
  
  return (
    <div className="cast-comparison mt-4">
      <h2>Confronto Cast</h2>
      <div className="d-flex flex-wrap">
        {allMembers.map(member => {
          let characterInfo = member.show1 ? 
            <p style={{color: "black", display: "flex", justifyContent: "center"}}><b>{member.show1}: </b></p> : null;
          let character1Info = member.character1 ? 
            <p style={{display: "flex", justifyContent: "center"}}>{member.character1}</p> : null;
          let show2Info = member.show2 ? 
            <p style={{color: "black", display: "flex", justifyContent: "center"}}><b>{member.show2}: </b></p> : null;
          let character2Info = member.character2 ? 
            <p style={{display: "flex", justifyContent: "center"}}>{member.character2}</p> : null;
          let characterInfo2 = member.character ? 
            <p style={{display: "flex", justifyContent: "center"}}>{member.character}</p> : null;
            
          return (
            <div 
              key={`${member.id}-${member.name}`}
              className={`card m-1 p-2 ${commonCast.includes(member) ? 'selected' : ''}`}
              style={{ width: "200px", justifyContent: "space-between", cursor: "pointer" }}
              onClick={() => onActorSelect(member)}
            >
              <img 
                src={member.profile ? `https://image.tmdb.org/t/p/w200${member.profile}` : '/images/user.png'} 
                className="card-img-top" 
                alt={member.name}
              />
              <span className="text-center infoAct">
                {member.name}<br />
                <span>
                  {characterInfo}
                  {character1Info}
                  {show2Info}
                  {character2Info}
                  {characterInfo2}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CastComparison;