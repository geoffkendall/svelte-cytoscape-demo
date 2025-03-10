// Enhanced type declarations for Cytoscape styles
declare module 'cytoscape' {
  interface CytoscapeStylesheet {
    selector: string;
    style: Record<string, any>;
  }
}
