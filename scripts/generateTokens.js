import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __filename and __dirname to ES module format
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory where the tokens live
const tokensDirectory = path.join(__dirname, '../tokens');

// Configuration for token files
import tokenConfig from '../src/config/tokenConfig.json' assert { type: 'json' };

const loadTokenFiles = (files) => {
  const tokens = {};
  files.forEach(file => {
    const filePath = path.join(tokensDirectory, file);
    if (fs.existsSync(filePath)) {
      const fileTokens = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      Object.assign(tokens, fileTokens);
    }
  });
  return tokens;
};

const primitives = loadTokenFiles(tokenConfig.colorPrimitives);
const semantics = loadTokenFiles(tokenConfig.colorSemantics);
const typographyPrimitives = loadTokenFiles(tokenConfig.typographyPrimitives);
const typographySemantics = loadTokenFiles(tokenConfig.typographySemantics);
const responsive = loadTokenFiles(tokenConfig.responsive);
const size = loadTokenFiles(tokenConfig.size);

const combinedTokens = {
  primitives,
  semantics,
  typographyPrimitives,
  typographySemantics,
  responsive,
  size,
};

fs.writeFileSync(path.join(__dirname, '../src/config/combinedTokens.json'), JSON.stringify(combinedTokens, null, 2));
console.log('Tokens combined and written to src/config/combinedTokens.json');
