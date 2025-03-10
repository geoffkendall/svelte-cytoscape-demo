// Global type declarations
declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType<any>;
  export default component;
}

// Cytoscape module augmentation
declare module 'cytoscape' {
  // Allow any style properties
  interface StylesheetCSS {
    selector: string;
    style: Record<string, any>;
  }
}
