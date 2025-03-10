<script lang="ts">
  import { onMount, setContext } from "svelte";
  import cytoscape from "cytoscape";
  import dagre from "cytoscape-dagre";
  import cola from "cytoscape-cola";
  import GraphStyles from "./GraphStyles";

  // Register the layout extensions
  cytoscape.use(dagre);
  cytoscape.use(cola);

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

  // Define available layout types
  type LayoutType =
    | "cola"
    | "dagre"
    | "grid"
    | "random"
    | "circle"
    | "concentric";

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

  // Export props with types
  export let nodes: Node[] = [];
  export let edges: Edge[] = [];
  export let layout: LayoutType | LayoutOptions = "cola";

  let refElement: HTMLElement | null = null;
  let cyInstance: any = null;

  setContext("graphSharedState", {
    getCyInstance: () => cyInstance,
  });

  // Default layout configurations
  const layoutConfigs = {
    cola: {
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
      refresh: 2,
    },
    dagre: {
      name: "dagre",
      rankDir: "TB", // TB, BT, LR, or RL
      align: "UL", // UL, UR, DL, or DR
      ranker: "network-simplex", // network-simplex, tight-tree or longest-path
      nodeSep: 50, // distance between nodes in the same rank
      edgeSep: 10, // distance between parallel edges
      rankSep: 50, // distance between adjacent ranks
      padding: 30,
      animate: true,
      animationDuration: 800,
      fit: true,
    },
    grid: {
      name: "grid",
      fit: true,
      padding: 30,
      rows: undefined, // automatically calculated if not specified
      columns: undefined, // automatically calculated if not specified
      avoidOverlap: true,
    },
    random: {
      name: "random",
      fit: true,
      padding: 50,
    },
    circle: {
      name: "circle",
      fit: true,
      padding: 30,
      radius: undefined, // automatically calculated if not specified
      startAngle: (3 / 2) * Math.PI, // start at top
      sweep: undefined, // how many radians to sweep
      clockwise: true, // clockwise or counterclockwise
      sort: undefined, // a sorting function to order the nodes
    },
    concentric: {
      name: "concentric",
      fit: true,
      padding: 30,
      startAngle: (3 / 2) * Math.PI, // start at top
      sweep: undefined, // how many radians to sweep
      clockwise: true, // clockwise or counterclockwise
      equidistant: false, // whether levels have an equal radial distance between them
      minNodeSpacing: 10, // min spacing between outside of nodes
      avoidOverlap: true, // prevents node overlap
    },
  };

  // Get the layout options based on the layout prop
  const getLayoutOptions = () => {
    if (typeof layout === "string") {
      return layoutConfigs[layout] || layoutConfigs.cola;
    } else {
      // If layout is an object, merge it with the default config for that layout type
      const baseConfig = layoutConfigs[layout.name as LayoutType] || {};
      return { ...baseConfig, ...layout };
    }
  };

  // Function to initialize or update the graph
  function initializeGraph() {
    if (!refElement) return;

    // Format elements for Cytoscape
    // Use explicit type annotation to avoid implicit 'any' errors
    const elements: Array<{
      group: "nodes" | "edges";
      data: any;
    }> = [];

    // Add nodes
    nodes.forEach((node: Node) => {
      elements.push({
        group: "nodes",
        data: { ...node },
      });
    });

    // Add edges
    edges.forEach((edge: Edge) => {
      elements.push({
        group: "edges",
        data: { ...edge },
      });
    });

    // Get the layout options
    const layoutOptions = getLayoutOptions();

    if (!cyInstance) {
      // Initialize cytoscape if it doesn't exist yet
      cyInstance = cytoscape({
        container: refElement,
        elements: elements,
        style: GraphStyles,
        layout: layoutOptions,
      });
    } else {
      // Apply new layout to existing graph
      cyInstance.layout(layoutOptions).run();
    }
  }

  // React to changes in the layout prop
  $: if (layout && cyInstance) {
    const layoutOptions = getLayoutOptions();
    cyInstance.layout(layoutOptions).run();
  }

  // Function to add hover effects using Cytoscape's built-in styling
  function addHoverEffects() {
    if (!cyInstance) return;

    // Add hover styles to the stylesheet
    const hoverStyles = [
      {
        selector: 'node.hover',
        style: {
          'background-color': '#ff7f50',
          'border-width': 3,
          'border-color': '#ff4500',
          'border-opacity': 1,
          'z-index': 999
        }
      },
      {
        selector: 'edge.hover',
        style: {
          'line-color': '#ff4500',
          'width': 4,
          'target-arrow-color': '#ff4500',
          'source-arrow-color': '#ff4500',
          'z-index': 999
        }
      }
    ];

    // Add hover styles to the stylesheet
    cyInstance.style().append(hoverStyles);

    // Create a div for tooltips
    const tooltip = document.createElement('div');
    tooltip.setAttribute('id', 'cy-tooltip');
    tooltip.style.position = 'absolute';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = 'white';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    document.body.appendChild(tooltip);

    // Add mouseover event listener
    cyInstance.on('mouseover', 'node, edge', (event: any) => {
      const target = event.target;
      
      // Add hover class to the element
      target.addClass('hover');
      
      // Get element data
      const data = target.data();
      let tooltipContent = '';
      
      if (target.isNode()) {
        tooltipContent = `
          <div style="text-align: center;">
            <strong>${data.label || data.id}</strong>
            ${data.description ? `<p>${data.description}</p>` : ''}
          </div>
        `;
      } else if (target.isEdge()) {
        tooltipContent = `
          <div style="text-align: center;">
            <strong>Edge: ${data.id}</strong>
            <p>Source: ${data.source}</p>
            <p>Target: ${data.target}</p>
            ${data.label ? `<p>Label: ${data.label}</p>` : ''}
          </div>
        `;
      }
      
      // Update tooltip content and position
      tooltip.innerHTML = tooltipContent;
      tooltip.style.display = 'block';
      
      // Position the tooltip near the cursor
      const renderedPosition = event.renderedPosition || event.cyRenderedPosition;
      if (renderedPosition) {
        tooltip.style.left = (renderedPosition.x + 15) + 'px';
        tooltip.style.top = (renderedPosition.y + 15) + 'px';
      }
    });
    
    // Add mouseout event listener
    cyInstance.on('mouseout', 'node, edge', (event: any) => {
      const target = event.target;
      
      // Remove hover class
      target.removeClass('hover');
      
      // Hide tooltip
      tooltip.style.display = 'none';
    });
    
    // Update tooltip position on mousemove
    cyInstance.on('mousemove', 'node, edge', (event: any) => {
      const renderedPosition = event.renderedPosition || event.cyRenderedPosition;
      if (renderedPosition) {
        tooltip.style.left = (renderedPosition.x + 15) + 'px';
        tooltip.style.top = (renderedPosition.y + 15) + 'px';
      }
    });
  }

  onMount(() => {
    initializeGraph();
    // Add hover effects after the graph is initialized
    setTimeout(addHoverEffects, 100);
  });
  
  // React to changes in the layout prop
  $: if (layout && cyInstance) {
    const layoutOptions = getLayoutOptions();
    cyInstance.layout(layoutOptions).run();
  }
</script>

<div class="graph" bind:this={refElement}></div>
