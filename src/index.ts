import { Lexer } from './Lexer.js';


const lexer = new Lexer({
    allowedKeys: ['from', 'has', 'priority']
});

const difficultInput = 'from:"Sing Li" has:link priority:high "fix critical bug"';


console.log("--- Input ---");
console.log(difficultInput);

const result = lexer.parse(difficultInput);

console.log("\n--- Parsed Output ---");
console.log(JSON.stringify(result, null, 2));


// We check if 'from' exists AND if the FIRST item matches
if (result.filters.from && result.filters.from[0] === "Sing Li") {
    console.log("\n✅ SUCCESS: Handled the space correctly.");
} else {
    console.log("\n❌ FAILURE: Still broken.");
    console.log("Got:", result.filters.from); 
}