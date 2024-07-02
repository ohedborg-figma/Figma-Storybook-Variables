// src/stories/Shared/DoubleClickOverlay.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../Tokens.stories.css';

const DoubleClickOverlay = ({ selectedToken, referenceData, onClose }) => {
  return (
    <div className="reference-view">
      <span className="reference-close" onClick={onClose}>X</span>
      <h3>{selectedToken}</h3>
      <div className="used-by">
        <h4>Used by:</h4>
        {referenceData.length > 0 ? (
          <ul>
            {referenceData.map(token => (
              <li key={token}>{token}</li>
            ))}
          </ul>
        ) : (
          <p>No semantic tokens found.</p>
        )}
      </div>
    </div>
  );
};

DoubleClickOverlay.propTypes = {
  selectedToken: PropTypes.string,
  referenceData: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func,
};

export default DoubleClickOverlay;
