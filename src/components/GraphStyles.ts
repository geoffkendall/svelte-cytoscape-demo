// Define the styles as a proper Cytoscape stylesheet
// Use explicit type annotation for the stylesheet
const graphStyles: Array<{
  selector: string;
  style: Record<string, any>;
}> = [
  {
    selector: 'node',
    style: {
      'width': '45',
      'height': '45',
      'font-size': '18',
      'font-weight': 'bold',
      'content': 'data(label)',
      'text-valign': 'center',
      'text-wrap': 'wrap',
      'text-max-width': '140',
      'background-color': 'gold',
      'border-color': 'orange',
      'border-width': '3',
      'color': 'darkred'
    }
  },
  {
    selector: 'node:selected',
    style: {
      'background-color': 'darkred',
      'color': 'white',
      'border-color': 'darkred',
      'line-color': '#0e76ba',
      'target-arrow-color': '#0e76ba'
    }
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'color': 'darkred',
      'text-background-color': '#ffffff',
      'text-background-opacity': '1',
      'text-background-padding': '3',
      'width': '2',
      'target-arrow-shape': 'triangle',
      'line-color': 'darkred',
      'target-arrow-color': 'darkred',
      'arrow-scale': 1,
      'font-weight': 'bold'
    }
  },
  {
    selector: 'edge[label]',
    style: {
      'content': 'data(label)'
    }
  },
  {
    selector: 'edge.label',
    style: {
      'line-color': 'orange',
      'target-arrow-color': 'orange'
    }
  }
];

export default graphStyles;
