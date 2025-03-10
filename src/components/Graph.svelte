<script lang="ts">
  import { onMount, setContext } from "svelte";
  import cytoscape from "cytoscape";
  // Type assertion to handle extension registration
  const cytoscapeWithExtensions = cytoscape as any;
  import dagre from "cytoscape-dagre";
  import cola from "cytoscape-cola";
  import GraphStyles from "./GraphStyles";

  // Define TypeScript types
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

  // Export props with types
  export let nodes: Node[] = [];
  export let edges: Edge[] = [];

  setContext("graphSharedState", {
    getCyInstance: () => cyInstance,
  });

  let refElement: HTMLElement | null = null;
  let cyInstance: any = null;

  // Cola layout configuration with proper types
  const colaLayoutOptions: any = {
    name: "cola",
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    maxSimulationTime: 4000,
    nodeSpacing: 40,
    padding: 80,
    edgeLength: 180,
    unconstrIter: 20,
    userConstIter: 25,
    allConstIter: 30,
    fit: true,
    handleDisconnected: true,
    infinite: false,
    randomize: false,
    refresh: 2
  };

  onMount(() => {
    // Register the layout extensions
    cytoscapeWithExtensions.use(dagre);
    cytoscapeWithExtensions.use(cola);

    // Format elements for Cytoscape
    const elements: any[] = [];
    
    // Add nodes
    nodes.forEach((node: Node) => {
      elements.push({
        group: 'nodes',
        data: { ...node }
      });
    });
    
    // Add edges
    edges.forEach((edge: Edge) => {
      elements.push({
        group: 'edges',
        data: { ...edge }
      });
    });

    // Initialize cytoscape with all elements at once
    cyInstance = cytoscapeWithExtensions({
      container: refElement,
      elements: elements,
      style: GraphStyles as any,
      layout: colaLayoutOptions
    });

    // Force layout to run again after a short delay to ensure edges are visible
    setTimeout(() => {
      if (cyInstance) {
        cyInstance.layout(colaLayoutOptions).run();
      }
    }, 500);
  });
</script>

<div class="graph" bind:this={refElement}></div>
