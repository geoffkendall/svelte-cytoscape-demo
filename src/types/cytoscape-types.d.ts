// Enhanced type declarations for Cytoscape
declare module 'cytoscape' {
  // Core instance type
  export interface Core {
    layout(options: any): any;
  }

  // Element definition for nodes and edges
  export interface ElementDefinition {
    group: 'nodes' | 'edges';
    data: Record<string, any>;
  }

  // Main function signature
  function cytoscape(options: {
    container: HTMLElement | null;
    elements: ElementDefinition[];
    style: any;
    layout: any;
  }): Core;

  // Extension registration
  namespace cytoscape {
    export function use(extension: any): void;
    export interface Core {
      layout(options: any): any;
    }
    export interface ElementDefinition {
      group: 'nodes' | 'edges';
      data: Record<string, any>;
    }
  }

  export default cytoscape;
}
