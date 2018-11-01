import React from 'react';

const style={
  background: 'silver',
  height: '100px',
  width: '150px',
  borderRadius: '5px',
  padding: '5px',
  border: 'thin solid gray',
  textAlign: 'center'
}

const ContextCards = ({cards}) => console.log('->', cards) || (
  <div className="context-cards-container">

    <ul className="no-bullets">
      {cards.map(card => (
        <li key={card.content}>
          <div style={style}>
            <div>{card.card_name}</div>
            <div><a href={`http://joaddress/bundle/${card.card_slug}`}>Jo, Do it!</a></div>
          </div>
        </li>
      ))}
    </ul>

  </div>
);

export default ContextCards;
