interface CodeSyntax {
    WEB: string;
  }
  
  interface FigmaExtensions {
    hiddenFromPublishing: boolean;
    scopes: string[];
    codeSyntax: CodeSyntax;
  }
  
  interface Extensions {
    figma: FigmaExtensions;
  }
  
  interface Token {
    $type: string;
    $value: string;
    $description: string;
    $extensions: Extensions;
  }
  
  interface Tokens {
    [key: string]: {
      [key: string]: Token;
    };
  }
  