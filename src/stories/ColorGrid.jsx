// src/stories/ColorGrid.jsx
import React, { useState, useEffect } from 'react';
import { loadTokens } from '../utils/loadTokens';
import HoverOverlay from './Shared/HoverOverlay';
import DoubleClickOverlay from './Shared/DoubleClickOverlay';
import './Tokens.stories.css';

const getReferencedColor = (value, primitives) => {
  if (typeof value === 'string' && value.startsWith('{')) {
    const reference = value.replace(/[{}]/g, '');
    return primitives[reference]?.$value || '#ffffff';
  }
  return value;
};

const TokenDisplay = ({ name, value, type, primitives, onMouseEnter, onMouseLeave, onDoubleClick }) => (
  <div className={`token ${type}`} data-token-name={name}
    onMouseEnter={(event) => onMouseEnter(name, type, event)} onMouseLeave={onMouseLeave} onDoubleClick={onDoubleClick}>
    <div className="token-swatch" style={{ backgroundColor: type === 'semantic' ? getReferencedColor(value, primitives) : value }}></div>
    <div className="token-name">{name}</div>
    <div className="token-value">{value}</div>
  </div>
);

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

const ColorGrid = ({ type, primitives, semantics }) => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ top: -1, left: -1 });
  const [referenceOverlayVisible, setReferenceOverlayVisible] = useState(false);
  const [referenceData, setReferenceData] = useState([]);
  const mergedTokens = loadTokens();

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
    console.log(`Double-clicked token: ${name}`);
    const semantic = semantics[name];
    let primitiveName = name;

    if (semantic) {
      primitiveName = semantic.$value.replace(/[{}]/g, '');
      console.log(`Found semantic for ${name}: ${primitiveName}`);
      const primitiveElement = document.querySelector(`[data-token-name="${primitiveName}"]`);
      if (primitiveElement) {
        primitiveElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        primitiveElement.classList.add('highlight');
        setTimeout(() => {
          primitiveElement.classList.remove('highlight');
        }, 2000);
      }
    }

    // Set the reference data for the overlay
    const semanticTokens = Object.keys(mergedTokens).filter(key => {
      const value = mergedTokens[key]?.$value;
      return typeof value === 'string' && value.replace(/[{}]/g, '') === primitiveName;
    });

    console.log(`Semantic tokens referencing ${primitiveName}:`, semanticTokens);

    setReferenceData(semanticTokens);
    setReferenceOverlayVisible(true);
  };

  const closeReferenceOverlay = () => {
    setReferenceOverlayVisible(false);
    setReferenceData([]);
  };

  const flattenedPrimitives = flattenTokens(primitives);
  const flattenedSemantics = flattenTokens(semantics);
  const tokensToDisplay = type === 'primitive' ? flattenedPrimitives : flattenedSemantics;

  return (
    <div className="token-grid">
      {type === 'combined' && <h2 className="section-title">Primitives</h2>}
      <div className="tokens">
        {type !== 'semantic' && Object.keys(flattenedPrimitives).map(key => (
          <TokenDisplay
            key={key}
            name={key}
            value={flattenedPrimitives[key]?.$value}
            type="primitive"
            primitives={flattenedPrimitives}
            onMouseEnter={(event) => handleMouseEnter(key, 'primitive', event)}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={() => handleDoubleClick(key)}
          />
        ))}
      </div>
      {type === 'combined' && <h2 className="section-title">Semantics</h2>}
      <div className="tokens">
        {type !== 'primitive' && Object.keys(flattenedSemantics).map(key => (
          <TokenDisplay
            key={key}
            name={key}
            value={flattenedSemantics[key]?.$value}
            type="semantic"
            primitives={flattenedPrimitives}
            onMouseEnter={(event) => handleMouseEnter(key, 'semantic', event)}
            onMouseLeave={handleMouseLeave}
            onDoubleClick={() => handleDoubleClick(key)}
          />
        ))}
      </div>
      {selectedToken && hoverPosition.top !== -1 && hoverPosition.left !== -1 && (
        <HoverOverlay 
          hoverPosition={hoverPosition} 
          selectedToken={selectedToken} 
          semantics={flattenedSemantics} 
        />
      )}
      {referenceOverlayVisible && (
        <div className="reference-overlay">
          <DoubleClickOverlay 
            selectedToken={selectedToken} 
            referenceData={referenceData} 
            onClose={closeReferenceOverlay} 
          />
        </div>
      )}
    </div>
  );
};

export default ColorGrid;
