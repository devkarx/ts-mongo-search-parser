import type { ISearchFilters, IParsedQuery, IParserOptions } from './types.js';

export class Lexer {
    private allowedKeys: Set<string>;

    constructor(options: IParserOptions) {
        this.allowedKeys = new Set(options.allowedKeys);
    }

    /**
     * The Main Function: Converts a raw string into a structured object.
     * Fixes the "Space Bug" by handling quotes correctly.
     */
    public parse(input: string): IParsedQuery {
        const filters: ISearchFilters = {};
        let cleanText = input;

        // Regex Explanation:
        // Group 1: Key (e.g., 'from')
        // Group 2: Quoted Value (e.g., 'Sing Li')
        // Group 3: Simple Value (e.g., 'me')
        const regex = /\b(\w+):(?:"([^"]+)"|(\S+))/g;

        let match;
        while ((match = regex.exec(input)) !== null) {
            const [fullMatch, key, quotedValue, simpleValue] = match;

            // SAFETY: Skip if key is missing (TypeScript strictness)
            if (!key) continue;

            const value = quotedValue || simpleValue;

            // VALIDATOR: Only accept keys we know about
            if (this.allowedKeys.has(key)) {
                
                // Initialize array if it doesn't exist
                // We cast to 'any' here because TypeScript knows 'from' is specific,
                // but we are writing generic code for ALL keys.
                if (!(filters as any)[key]) {
                    (filters as any)[key] = [];
                }

                // PUSH the value (Store as Array)
                (filters as any)[key].push(value);

                // Remove the token from the text
                cleanText = cleanText.replace(fullMatch, "");
            }
        }

        // Cleanup: Remove double spaces left behind by replacements
        const finalText = cleanText.replace(/\s+/g, " ").trim();

        return {
            filters,
            text: finalText
        };
    }
}