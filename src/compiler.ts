import { SearchNode } from './ast';

export class Compiler {
  // This is the entry point
  public compile(ast: SearchNode): any {
    // We will switch based on what kind of node we are looking at
    switch (ast.type) {
      case 'Binary':
        return this.visitBinary(ast);
      case 'Filter':
        return this.visitFilter(ast);
      default:
        throw new Error(`Unknown node type`);
    }
  }

  // Handle AND / OR
  private visitBinary(node: any): any {
    console.log("Compiling Binary Logic...");
    return {}; // Placeholder
  }

  // Handle "status:open"
  private visitFilter(node: any): any {
    console.log(`Compiling Filter: ${node.field} = ${node.value}`);
    return {}; // Placeholder
  }
}