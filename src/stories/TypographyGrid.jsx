import React, { useState, useEffect } from 'react';
import './Tokens.stories.css';

const resolveTokenReference = (value, tokens) => {
  if (typeof value === 'string' && value.startsWith('{')) {
    const reference = value.replace(/[{}]/g, '');
    return tokens[reference]?.$value || value;
  }
  return value;
};

const getTypographyStyle = (token, primitives, semantics) => {
  const style = {};
  const resolvedValue = resolveTokenReference(token.$value, {...primitives, ...semantics});
  if (typeof resolvedValue === 'number') {
    style.fontSize = '14px'; // Set a default font size for all tokens
  }
  return style;
};

const TokenDisplay = ({ name, value, type, primitives, semantics, onMouseEnter, onMouseLeave, onDoubleClick }) => (
  <div className={`token ${type}`} data-token-name={name} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onDoubleClick={onDoubleClick}>
    <div className="token-name" style={getTypographyStyle(value, primitives, semantics)}>{name}</div>
  </div>
);

const PrimitiveView = ({ selectedToken, semantics }) => {
  const semanticTokens = Object.keys(semantics).filter(key =>
    semantics[key].$value && semantics[key].$value.replace(/[{}]/g, '') === selectedToken
  );

  return (
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
  );
};

const SemanticView = ({ selectedToken, semantics }) => {
  const semanticToken = semantics[selectedToken];
  if (!semanticToken || !semanticToken.$value) return null;
  const primitiveToken = semanticToken.$value.replace(/[{}]/g, '');
  return (
    <div className="details">
      <h3>{selectedToken}</h3>
      <div className="aliases">
        <h4>Aliases:</h4>
        <p>{primitiveToken}</p>
      </div>
    </div>
  );
};

const flattenTokens = (tokens, parentKey = '') => {
  return Object.keys(tokens).reduce((acc, key) => {
    const value = tokens[key];
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (value && typeof value === 'object' && !value.$value) {
      Object.assign(acc, flattenTokens(value, newKey));
    } else {
      acc[newKey] = value;
    }

    return acc;
  }, {});
};

const TypographyGrid = ({ type, primitives, semantics }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: -1, left: -1 });

  useEffect(() => {
    let cursorX = -1;
    let cursorY = -1;

    const updateMousePosition = (event) => {
      cursorX = event.pageX;
      cursorY = event.pageY;
    };

    const updateHoverPosition = () => {
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      setHoverPosition({ top: cursorY - scrollY, left: cursorX - scrollX });
    };

    document.addEventListener('mousemove', updateMousePosition);
    const intervalId = setInterval(updateHoverPosition, 100);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      clearInterval(intervalId);
    };
  }, []);

  const handleMouseEnter = (name, tokenType) => {
    setSelectedToken(name);
  };

  const handleMouseLeave = () => {
    setSelectedToken(null);
  };

  const handleDoubleClick = (name) => {
    const semantic = semantics[name];
    if (semantic) {
      const primitiveName = semantic.$value.replace(/[{}]/g, '');
      const primitiveElement = document.querySelector(`[data-token-name="${primitiveName}"]`);
      if (primitiveElement) {
        primitiveElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        primitiveElement.classList.add('highlight');
        setTimeout(() => {
          primitiveElement.classList.remove('highlight');
        }, 2000);
      }
    }
  };

  const flattenedPrimitives = flattenTokens(primitives);
  const flattenedSemantics = flattenTokens(semantics);
  const tokensToDisplay = type === 'primitive' ? flattenedPrimitives : flattenedSemantics;

  return (
    <div className="token-grid">
      <div className="tokens">
        {Object.keys(tokensToDisplay).map(key => (
          <TokenDisplay
            key={key}
            name={key}
            value={tokensToDisplay[key]}
            type={type}
            primitives={flattenedPrimitives}
            semantics={flattenedSemantics}
            onMouseEnter={() => handleMouseEnter(key, type)}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={() => handleDoubleClick(key)}
          />
        ))}
      </div>
      {selectedToken && hoverPosition.top !== -1 && hoverPosition.left !== -1 && (
        <div className="overlay" style={{ top: hoverPosition.top + 10, left: hoverPosition.left + 10 }}>
          {flattenedPrimitives[selectedToken] ? (
            <PrimitiveView selectedToken={selectedToken} semantics={flattenedSemantics} />
          ) : (
            <SemanticView selectedToken={selectedToken} semantics={flattenedSemantics} />
          )}
        </div>
      )}
    </div>
  );
};

export default TypographyGrid;
