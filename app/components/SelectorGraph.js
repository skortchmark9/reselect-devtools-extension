import React, { Component, PropTypes } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

const truncateText = (str, maxChars = 20) => (str.length > maxChars ? str.slice(0, maxChars) : str);
const labelText = (id, recomputations) => truncateText(id) + (recomputations === null ? '' : ` (${recomputations})`);

const defaultEdgeStyle = {
  'curve-style': 'bezier',
  width: 4,
  'target-arrow-shape': 'triangle',
  'line-color': 'rgb(79, 90, 101)',
  'target-arrow-color': 'rgb(79, 90, 101)',
  'z-index': 1,
};

const selectedNodeStyle = {
  'background-color': '#ff4c4c'
};

const defaultNodeStyle = {
  label: 'data(label)',
  color: 'rgb(111, 179, 210)',
  'background-color': 'rgb(232, 234, 246)',
};

const cytoDefaults = {
  style: [
    {
      selector: 'edge',
      style: defaultEdgeStyle
    },
    {
      selector: 'node',
      style: defaultNodeStyle
    }
  ],
  layout: {
    name: 'dagre',
    rankDir: 'BT',
    ranker: 'longest-path',
    spacingFactor: 0.10,
    padding: 0,
    nodeDimensionsIncludeLabels: true,
  }
};

function createCytoElements(nodes, edges) {
  const cytoNodes = Object.keys(nodes).map(name => ({
    data: Object.assign({}, nodes[name], {
      id: name,
      label: labelText(name, nodes[name].recomputations)
    }),
  }));


  const cytoEdges = edges.map((edge, i) => ({ data: {
    source: edge.from,
    target: edge.to,
    id: i,
  } }));

  return cytoNodes.concat(cytoEdges);
}


export function drawCytoscapeGraph(container, nodes, edges) {
  const elements = createCytoElements(nodes, edges);
  return cytoscape({ ...cytoDefaults, container, elements });
}

function paintDependencies(elts) {
  elts.forEach((elt) => {
    if (elt.isNode()) {
      elt.style({
        'background-color': '#ffeb3b',
      });
    } else if (elt.isEdge()) {
      elt.style({
        'line-color': '#d4d43a',
        'z-index': 99,
        'target-arrow-color': '#d4d43a',
      });
    }
  });
}

export default class SelectorGraph extends Component {
  static propTypes = {
    nodes: PropTypes.object.isRequired,
    edges: PropTypes.array.isRequired,
    checkSelector: PropTypes.func,
    selector: PropTypes.object,
  };

  componentDidMount() {
    this.cy = drawCytoscapeGraph(this.cyElement, this.props.nodes, this.props.edges);
    const pan = this.cy.pan();
    const height = this.cy.height();
    this.cy.pan({ ...pan, y: -height });
    this.bindEvents();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nodes !== this.props.nodes || nextProps.edges !== this.props.edges) {
      const { nodes, edges } = nextProps;
      const elements = createCytoElements(nodes, edges);
      this.cy.json({ elements });
    }

    if (nextProps.selector !== this.props.selector) {
      this.paintNodeSelection(nextProps.selector);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (this.cy) this.cy.destroy();
  }

  paintNodeSelection(selector) {
    const { label, ...nodeStyle } = defaultNodeStyle; // eslint-disable-line no-unused-vars
    this.cy.nodes().style(nodeStyle);
    this.cy.edges().style(defaultEdgeStyle);

    if (!selector || !selector.id) return;

    // can't search with selectors because special chars, i.e. $ interfere
    const selectedNode = this.cy.nodes(node => node.data().id === selector.id);
    selectedNode.style(selectedNodeStyle);
    paintDependencies(selectedNode.successors());
  }

  bindEvents() {
    const { checkSelector } = this.props;
    function clickHandler() {
      const data = this.data();
      checkSelector(data);
    }
    if (checkSelector) {
      this.cy.on('tap', 'node', clickHandler);
    }
  }

  render() {
    return <div style={{ height: '100%' }} ref={(e) => { this.cyElement = e; }} />;
  }
}
