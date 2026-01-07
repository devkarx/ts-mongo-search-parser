export interface FilterNode {
    type: 'Filter';
    field: string;
    value: string;
}

export interface BinaryNode {
    type:'Binary';
    operator: 'AND' | 'OR';
    left: SearchNode;
    right: SearchNode;
}

export type SearchNode = FilterNode | BinaryNode