import { type ISearchFilters, type IParsedQuery, type IParserOptions, type Token, TokenType } from './types';

export class Lexer {
    private input: string;
    private position: number = 0;
    private currentChar: string | null = null;

    constructor(input: string) {
        this.input = input;
        this.position = 0;
        this.currentChar = this.input.length > 0 ? (this.input[0] ?? null) : null;
    }

    // Helper: Move the cursor forward one step
    private advance(): void {
        this.position++;
        if (this.position < this.input.length) {
            this.currentChar = this.input[this.position] || null;
        } else {
            this.currentChar = null;
        }
    }

    // Helper: Skip whitespace (spaces, tabs)
    private skipWhitespace(): void {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }

    // The Main Engine
    public tokenize(): Token[] {
        const tokens: Token[] = [];

        while (this.currentChar !== null) {
            // 1. Handle Whitespace
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }

            // 2. Handle Parentheses (Single character tokens)
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

            // 3. Handle Words (Keywords or Filters)
            // If it's not a space or symbol, it must be part of a word/filter
            tokens.push(this.readWord());
        }

        return tokens;
    }

    private readWord(): Token {
    let result = '';
    const startPos = this.position; 

   
    while (this.currentChar !== null && !/\s/.test(this.currentChar) && this.currentChar !== '(' && this.currentChar !== ')') {
      result = result + this.currentChar;
      this.advance();
    }

    let upper = result.toUpperCase();
    

    if (upper === "OR") {
        return { type: TokenType.OR, value: result, position: startPos };
    }
    if (upper === "AND") {
        return { type: TokenType.AND, value: result, position: startPos };
    }
    const type = result.includes(':') ? TokenType.FILTER : TokenType.TEXT;

    return { type: type, value: result, position: startPos };
  }
}