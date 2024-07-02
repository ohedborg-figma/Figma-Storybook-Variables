import fs from 'fs';
import path from 'path';

// Directory where the tokens live
const tokensDirectory = './tokens';
const outputDirectory = './src/tokens';
const outputFile = 'mergedTokens.json';

const mergeTokens = () => {
  const mergedTokens = {};
  const files = fs.readdirSync(tokensDirectory);

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(tokensDirectory, file);
      const tokenData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      Object.assign(mergedTokens, tokenData);
    }
  });

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  const outputPath = path.join(outputDirectory, outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(mergedTokens, null, 2));
  console.log(`Tokens merged into ${outputPath}`);
};

mergeTokens();
