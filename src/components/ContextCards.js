import React from 'react';


const ContextCards = ({cards}) => (
  <div className="context-cards-container">
  
  <ul className="no-bullets">
    {cards.map(card => (
      <li key={card.name}>{card.name}</li>
    ))}
  </ul>

  </div>
);

export default ContextCards;
