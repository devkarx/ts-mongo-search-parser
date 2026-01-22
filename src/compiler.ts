import { SearchNode } from './ast';

export class Compiler {
  
  /**
   * Main Entry Point
   * Takes an AST Node and returns a MongoDB Query Object
   */
  public compile(ast: SearchNode): any {
    switch (ast.type) {
      case 'Binary':
        return this.visitBinary(ast);
      case 'Filter':
        return this.visitFilter(ast);
      default:
        throw new Error(`Unknown node type`);
    }
  }

  // 1. Handle Logic (AND / OR)
  private visitBinary(node: any): any {
    // Convert "OR" -> "$or", "AND" -> "$and"
    const mongoOperator = node.operator === 'OR' ? '$or' : '$and';

    return {
      [mongoOperator]: [
        this.compile(node.left),  // Recursively compile the left side
        this.compile(node.right)  // Recursively compile the right side
      ]
    };
  }

  // 2. Handle Data (status:open)
  private visitFilter(node: any): any {
    // Special Case: Full Text Search
    if (node.field === 'text') {
      return { 
        "$text": { "$search": node.value } 
      };
    }

    // Normal Case: Field Match
    return { 
      [node.field]: node.value 
    };
  }
}