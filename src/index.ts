import { Lexer } from './Lexer';
import { Parser } from './parser';
import { Compiler } from './compiler';

// Example Query: Testing Implicit AND ('deadline passed')
const query = 'deadline passed';

console.log("--- 1. INPUT QUERY ---");
console.log(query);
console.log("\n");

try {
  // Step 1: Lexer
  // Convert the raw string into a list of Tokens
  const lexer = new Lexer(query);
  const tokens = lexer.tokenize();

  console.log("--- 2. TOKENS ---");
  tokens.forEach(t => console.log(`[${t.type}] ${t.value}`));
  console.log("\n");

  // Step 2: Parser
  // Organize tokens into an Abstract Syntax Tree (AST)
  const parser = new Parser(tokens);
  const ast = parser.parse();
  
  console.log("--- 3. ABSTRACT SYNTAX TREE (AST) ---");
  console.log(JSON.stringify(ast, null, 2));

  // Step 3: Compiler
  // Translate the AST into a MongoDB Aggregation Pipeline
  console.log("\n--- 4. COMPILER OUTPUT (MongoDB Query) ---");
  const compiler = new Compiler();
  const mongoQuery = compiler.compile(ast);
  
  console.log(JSON.stringify(mongoQuery, null, 2));

} catch (error) {
  console.error(" PARSING FAILED:", error);
}