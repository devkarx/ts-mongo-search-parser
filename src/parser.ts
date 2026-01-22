import { TokenType } from "./types";
import type { Token } from "./types";
import type { SearchNode } from "./ast";

export class Parser {
  private tokens: Token[];
  private position: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  // Helper: Look at the current token without moving forward
  private peek(): Token | null {
    return this.tokens[this.position] || null;
  }

  // Helper: Get the current token and move to the next one
  private consume(): Token {
    const token = this.tokens[this.position];
    if (!token) {
      throw new Error("Unexpected end of input");
    }
    this.position++;
    return token;
  }

  // Helper: Check if the current token matches a specific type
  private match(type: TokenType): boolean {
    const token = this.peek();
    return token !== null && token.type === type;
  }

  public parse(): SearchNode {
    return this.parseExpression();
  }

  // 1. Parse OR Logic (Lowest Precedence)
  private parseExpression(): SearchNode {
    let left = this.parseTerm();

    while (this.match(TokenType.OR)) {
      this.consume(); // Eat 'OR'
      const right = this.parseTerm();

      left = {
        type: 'Binary',
        operator: 'OR',
        left,
        right,
      };
    }

    return left;
  }

  // 2. Parse AND Logic (Medium Precedence)
  private parseTerm(): SearchNode {
    let left = this.parseFactor();

    while (true) {
      const next = this.peek();

      // Stop if we hit a boundary
      if (!next || next.type === TokenType.OR || next.type === TokenType.RPAREN) {
        break;
      }

      // Implicit or Explicit AND
      if (next.type === TokenType.AND) {
        this.consume();
      }

      const right = this.parseFactor();

      left = {
        type: 'Binary',
        operator: 'AND',
        left,
        right,
      };
    }

    return left;
  }

  // 3. Parse Atoms (Highest Precedence)
  private parseFactor(): SearchNode {
    // Check for Grouping: ( ... )
    if (this.match(TokenType.LPAREN)) {
      this.consume(); // Eat '('
      const node = this.parseExpression(); // Recursion
      this.consume(); // Eat ')'
      return node;
    }

    const token = this.consume();

    if (token.type === TokenType.FILTER || token.type === TokenType.TEXT) {
      // If it looks like a filter (key:value)
      if (token.value.includes(':')) {
        const [key, ...rest] = token.value.split(':');
        
        return {
          type: 'Filter',
          // FIX: Added "|| 'text'" to handle the undefined case
          field: key || 'text',
          value: rest.join(':')
        };
      }

      // Otherwise, it's just text
      return {
        type: 'Filter',
        field: 'text',
        value: token.value
      };
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }
}