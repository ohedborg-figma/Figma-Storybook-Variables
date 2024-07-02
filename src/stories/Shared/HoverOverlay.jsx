// src/stories/Shared/HoverOverlay.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../Tokens.stories.css';

const HoverOverlay = ({ hoverPosition, selectedToken, semantics }) => {
  if (!hoverPosition) return null;

  const semanticTokens = Object.keys(semantics).filter(key =>
    semantics[key]?.$value?.replace(/[{}]/g, '') === selectedToken
  );

  return (
    <div className="overlay" style={{ top: hoverPosition.top + 10, left: hoverPosition.left + 10 }}>
      <div className="details">
        <h3>{selectedToken}</h3>
        <div className="used-by">
          <h4>Used by:</h4>
          {semanticTokens.length > 0 ? (
            <ul>
              {semanticTokens.map(token => (
                <li key={token}>{token}</li>
              ))}
            </ul>
          ) : (
            <p>No semantic tokens found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

HoverOverlay.propTypes = {
  hoverPosition: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
  selectedToken: PropTypes.string,
  semantics: PropTypes.object,
};

export default HoverOverlay;
