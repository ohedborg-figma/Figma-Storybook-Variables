import React from 'react';
import ColorGrid from './ColorGrid';
import TypographyGrid from './TypographyGrid';
import './Tokens.stories.css';
import combinedTokens from '../config/combinedTokens.json'; // Import the combined tokens

const { primitives, semantics, typographyPrimitives, typographySemantics, responsive, size } = combinedTokens;

console.log('Color Primitives:', primitives);
console.log('Color Semantics:', semantics);
console.log('Typography Primitives:', typographyPrimitives);
console.log('Typography Semantics:', typographySemantics);
console.log('Responsive:', responsive);
console.log('Size:', size);

export default {
  title: 'Design Tokens',
};

export const ColorPrimitives = () => (
  <ColorGrid type="primitive" primitives={primitives} semantics={semantics} />
);
export const ColorSemantics = () => (
  <ColorGrid type="semantic" primitives={primitives} semantics={semantics} />
);
export const ColorAlias = () => (
  <ColorGrid type="combined" primitives={primitives} semantics={semantics} />
);
export const TypographyPrimitives = () => (
  <TypographyGrid type="primitive" primitives={typographyPrimitives} semantics={typographySemantics} />
);
export const TypographySemantics = () => (
  <TypographyGrid type="semantic" primitives={typographyPrimitives} semantics={typographySemantics} />
);
export const TypographyAlias = () => (
  <TypographyGrid type="combined" primitives={typographyPrimitives} semantics={typographySemantics} />
);
