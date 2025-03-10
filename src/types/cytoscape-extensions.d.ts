// Type declarations for Cytoscape extensions
declare module 'cytoscape-dagre';
declare module 'cytoscape-cola';

// Add Svelte component typings
declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}
