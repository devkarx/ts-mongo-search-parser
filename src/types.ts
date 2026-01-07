
// We allow specific keys, but we also allow an "index signature" 
// so we can extend it later without breaking the interface.
export interface ISearchFilters {
    from?: string[];       // Support multiple users: (from:me OR from:you)
    mentions?: string[];
    has?: 'link' | 'image' | 'file';
    priority?: 'high' | 'low';
    
    // The "Escape Hatch" for other keys
    [key: string]: any; 
}

export interface IParsedQuery {
    filters: ISearchFilters;
    text: string;
}

export interface IParserOptions {
    allowedKeys: string[]; // e.g., ['from', 'has', 'in']
}

export enum TokenType{
    OR = 'OR',
    AND = 'AND',

    LPAREN = 'LPAREN',
    RPAREN = 'RPAREN',

    FILTER = 'FILTER',
    TEXT = 'TEXT'
}

export interface Token {
    type: TokenType;
    position: number;
    value: string;
}