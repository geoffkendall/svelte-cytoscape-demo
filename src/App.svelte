<script lang="ts">
  import Graph from './components/Graph.svelte'
  
  // Define types using type aliases instead of interfaces
  type Node = {
    id: string;
    label: string;
  };

  type Edge = {
    id: string;
    source: string;
    target: string;
    label?: string;
  };

  // Define available layout types
  type LayoutType = 'cola' | 'dagre' | 'grid' | 'random' | 'circle' | 'concentric';

  // Layout options interface
  type LayoutOptions = {
    name: LayoutType;
    // Common layout options
    animate?: boolean;
    animationDuration?: number;
    fit?: boolean;
    padding?: number;
    // Additional options can be added based on specific layout needs
    [key: string]: any;
  };

  const nodes: Node[] = [
    { id: 'N1', label: 'Start' },
    { id: 'N2', label: '4' },
    { id: 'N4', label: '8' },
    { id: 'N5', label: '15' },
    { id: 'N3', label: '16' },
    { id: 'N6', label: '23' },
    { id: 'N7', label: '42' },
    { id: 'N8', label: 'End' }
  ];

  const edges: Edge[] = [
    { id: 'E1', source: 'N1', target: 'N2' },
    { id: 'E2', source: 'N2', target: 'N3' },
    { id: 'E3', source: 'N3', target: 'N6' },
    { id: 'E4', source: 'N2', target: 'N4' },
    { id: 'E5', source: 'N4', target: 'N5' },
    { id: 'E6', source: 'N5', target: 'N4', label: '2' },
    { id: 'E7', source: 'N5', target: 'N6' },
    { id: 'E8', source: 'N6', target: 'N7' },
    { id: 'E9', source: 'N7', target: 'N7', label: '3' },
    { id: 'E10', source: 'N7', target: 'N8' }
  ];

  // Default layout
  let currentLayout: LayoutType | LayoutOptions = 'cola';

  // Custom layout example
  const customDagreLayout: LayoutOptions = {
    name: 'dagre',
    rankDir: 'LR',  // Left to right layout
    nodeSep: 80,    // Increased node separation
    edgeSep: 20,    // Increased edge separation
    rankSep: 100,   // Increased rank separation
    animate: true,
    animationDuration: 1200
  };

  // Function to change layout
  function changeLayout(newLayout: LayoutType | LayoutOptions) {
    currentLayout = newLayout;
  }
</script>

<div class="container">
  <div class="controls">
    <h2>Cytoscape Layout Demo</h2>
    <div class="layout-buttons">
      <button on:click={() => changeLayout('cola')}>Cola</button>
      <button on:click={() => changeLayout('dagre')}>Dagre</button>
      <button on:click={() => changeLayout(customDagreLayout)}>Custom Dagre</button>
      <button on:click={() => changeLayout('grid')}>Grid</button>
      <button on:click={() => changeLayout('circle')}>Circle</button>
      <button on:click={() => changeLayout('concentric')}>Concentric</button>
      <button on:click={() => changeLayout('random')}>Random</button>
    </div>
  </div>
  
  <div class="graph-container">
    <Graph {nodes} {edges} layout={currentLayout} />
  </div>
</div>

<style>
  /* Add global scope to ensure styles are processed correctly */
  :global(html), :global(body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .controls {
    margin-bottom: 20px;
  }
  
  h2 {
    margin-top: 0;
    color: #333;
  }
  
  .layout-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  button {
    background-color: #ff3e00;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #ff6b31;
  }
  
  .graph-container {
    flex-grow: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
