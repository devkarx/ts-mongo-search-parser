import { Lexer } from './Lexer';
import { Parser } from './parser';
import { Compiler } from './compiler';

const scenarios = [
  { 
    name: "1. The Lazy User (Implicit AND)",
    query: "deadline passed" 
  },
  { 
    name: "2. The Power User (Complex Logic)",
    query: "status:open AND (urgent OR assigned:me)" 
  },
  { 
    name: "3. The Exact Phrase (Quoted Strings)",
    query: '"system failure" OR "critical error"' 
  },
  { 
    name: "4. The Mixed Bag",
    query: 'type:bug priority:high "login failed"' 
  }
];

const runDemo = () => {
  console.log(" STARTING PARSER DEMO 🚀\n");

  scenarios.forEach(scenario => {
    console.log(`--- ${scenario.name} ---`);
    console.log(`Input:  ${scenario.query}`);
    
    try {
      // 1. Lex
      const lexer = new Lexer(scenario.query);
      const tokens = lexer.tokenize();
      
      // 2. Parse
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      // 3. Compile
      const compiler = new Compiler();
      const mongoQuery = compiler.compile(ast);
      
      console.log("Mongo:", JSON.stringify(mongoQuery, null, 2));
      console.log(" Success\n");
    } catch (e) {
      console.error(" Failed:", e);
    }
  });
};

runDemo();