import { TokenType } from "./types";
import type { Token } from "./types";
import type { FilterNode, BinaryNode, SearchNode } from "./ast.js";

export class Parser {
    private tokens: Token[];
    private position: number=0;

    constructor(tokens:Token[]){
        this.tokens= tokens;
        this.position=0;
    }

    private peek(): Token | null  {
        if(this.position >= this.tokens.length) return null;
        return this.tokens[this.position] ?? null;
    }

    private consume() : Token  {
        const token = this.tokens[this.position];
        if(!token){
            throw new Error("Unexpected end of input")
        }
        this.position++
        return token;
    }

    private match(type: TokenType): boolean {
    const token = this.peek();
    if(!token)  return false;
    return token !== null && token.type === type;
  }
  public parse():SearchNode {
    return this.parseExpression();
  }

  private parseExpression(): SearchNode  {
    let left = this.parseTerm();

    while (this.match(TokenType.OR)) {
      this.consume(); // Eat the 'OR' token
      const right = this.parseTerm(); // Get the right side

      // 3. Combine them into a Binary Node
      left = {
        type: 'Binary',
        operator: 'OR',
        left: left,
        right: right,
      };
    }

    return left;
  }

  // Level 2: Handles AND (Medium Precedence)
  private parseTerm(): SearchNode  {
    // 1. Ask the lower level for an atom (Factor)
    let left = this.parseFactor();

    // 2. While we see 'AND', we glue things together
    while (this.match(TokenType.AND)) {
      this.consume(); // Eat the 'AND'
      const right = this.parseFactor(); // Get the next atom

      // 3. Make a Binary Node
      left = {
        type: 'Binary',
        operator: 'AND',
        left: left,
        right: right,
      };
    }

    return left;
  }

  // Level 3: Handles Atoms (Parentheses or Filters)
  private parseFactor(): SearchNode  {
    // Case 1: Parentheses -> ( Expression )
    if (this.match(TokenType.LPAREN)) {
      this.consume(); // Eat '('
      
      // RECURSION: Start the whole process again from the top!
      const node = this.parseExpression(); 
      
      this.consume(); // Eat ')'
      return node;
    }

    // Case 2: A simple Filter
    const token = this.consume();
    
    // Safety check: Make sure it's actually a filter/text
    if (token.type === TokenType.FILTER || token.type === TokenType.TEXT) {
        if( token.value.includes(':') ){
            const parts:string[]= token.value.split(':');
            return {
              type: 'Filter',
              field: parts[0] || 'text', 
              value: parts[1] || ''
            };
        }
        else{
            return {
              type: 'Filter',
              field: 'text', 
              value: token.value
            };
        }
    }

    throw new Error(`Unexpected token: ${token.value}`);
  }
}