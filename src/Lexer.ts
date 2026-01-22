import { Token, TokenType } from './types';

export class Lexer {
  private input: string;
  private position: number = 0;
  private currentChar: string | null = null;

  constructor(input: string) {
    this.input = input;
    this.currentChar = this.input.length > 0 ? this.input[0] || null : null;
  }

  private advance(): void {
    this.position++;
    if (this.position < this.input.length) {
      this.currentChar = this.input[this.position] || null;
    } else {
      this.currentChar = null;
    }
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.currentChar !== null) {
      // 1. Skip Spaces
      if (/\s/.test(this.currentChar)) {
        this.advance();
        continue;
      }

      // 2. Handle Parentheses
      if (this.currentChar === '(') {
        tokens.push({ type: TokenType.LPAREN, value: '(', position: this.position });
        this.advance();
        continue;
      }
      if (this.currentChar === ')') {
        tokens.push({ type: TokenType.RPAREN, value: ')', position: this.position });
        this.advance();
        continue;
      }

      // 3. NEW: Handle Quoted Strings (The Fix!)
      if (this.currentChar === '"') {
        tokens.push(this.readQuotedString());
        continue;
      }

      // 4. Handle Normal Words / Keywords
      tokens.push(this.readWord());
    }

    return tokens;
  }

  // --- NEW METHOD: Reads everything inside quotes ---
  private readQuotedString(): Token {
    const startPos = this.position;
    this.advance(); // Skip the opening quote "

    let result = '';
    
    // Keep eating until we hit the closing quote " or end of input
    while (this.currentChar !== null && this.currentChar !== '"') {
      result += this.currentChar;
      this.advance();
    }

    // Skip the closing quote "
    if (this.currentChar === '"') {
      this.advance();
    }

    // Return as plain TEXT (Keywords/Field logic ignored inside quotes)
    return { type: TokenType.TEXT, value: result, position: startPos };
  }

  private readWord(): Token {
    let result = '';
    const startPos = this.position;

    // Standard reading: stop at space, parens, OR QUOTES
    while (
      this.currentChar !== null && 
      !/\s/.test(this.currentChar) && 
      this.currentChar !== '(' && 
      this.currentChar !== ')' &&
      this.currentChar !== '"' // Stop if we hit a quote
    ) {
      result += this.currentChar;
      this.advance();
    }

    let upper = result.toUpperCase();
    
    // Check Keywords
    if (upper === "OR") return { type: TokenType.OR, value: "OR", position: startPos };
    if (upper === "AND") return { type: TokenType.AND, value: "AND", position: startPos };
    
    // Check Data
    const type = result.includes(':') ? TokenType.FILTER : TokenType.TEXT;
    return { type: type, value: result, position: startPos };
  }
}