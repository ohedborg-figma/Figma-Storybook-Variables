import mergedTokens from '../tokens/mergedTokens.json';

interface Token {
  $type: string;
  $value: string;
  $description: string;
  $extensions: {
    com: {
      figma: {
        hiddenFromPublishing: boolean;
        scopes: string[];
        codeSyntax: {};
      };
    };
  };
}

interface Tokens {
  [key: string]: {
    [key: string]: Token;
  };
}

export const loadTokens = (): Tokens => mergedTokens;
