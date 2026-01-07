import { Lexer } from './Lexer';
import { Parser } from './parser';

// The Test Query
// We are testing: OR logic, AND logic, Parentheses, and Fields
const query = "status:open OR (urgent AND assigned:me)";

console.log("--- 1. INPUT QUERY ---");
console.log(query);
console.log("\n");

// Step 1: Tokenize (Break string into Legos)
const lexer = new Lexer(query);
const tokens = lexer.tokenize();

console.log("--- 2. TOKENS (The Legos) ---");
tokens.forEach(t => console.log(`[${t.type}] ${t.value}`));
console.log("\n");

// Step 2: Parse (Build the Lego Castle)
const parser = new Parser(tokens);

try {
  const ast = parser.parse();
  
  console.log("--- 3. ABSTRACT SYNTAX TREE (The Result) ---");
  // JSON.stringify makes the tree readable with indentation
  console.log(JSON.stringify(ast, null, 2));

} catch (error) {
  console.error("PARSING FAILED:", error);
}