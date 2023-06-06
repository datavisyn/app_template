import * as React from 'react';
import dagre from 'dagre';
import { useAutocomplete, useGraph } from './store/store';
import { ReactFlow, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeWidth = 172;
const nodeHeight = 36;

const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const getLayoutedElements = (nodes, edges) => {

    dagreGraph.setGraph({ rankdir: 'LR' })

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {

      const nodeWithPosition = dagreGraph.node(node.id);

      node.targetPosition = 'top';
      node.sourcePosition = 'bottom';

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
  };

export default function DrugGraph() {

  var data = [
    {"gene":"ENSG00000030110","padj":51.9904494,"disease":"CHEBI_44185"},
    {"gene":"ENSG00000030110","padj":76.6553342,"disease":"EFO_0000095"},
    {"gene":"ENSG00000030110","padj":76.6553342,"disease":"EFO_0000183"},
    {"gene":"ENSG00000030110","padj":51.9904494,"disease":"EFO_0000270"},
    {"gene":"ENSG00000030110","padj":51.9904494,"disease":"EFO_0000685"},
    {"gene":"ENSG00000030110","padj":60.6275201,"disease":"EFO_0000692"},
    {"gene":"ENSG00000030110","padj":76.6553342,"disease":"EFO_0001378"},
    {"gene":"ENSG00000030110","padj":57.6489747,"disease":"EFO_0003885"},
    {"gene":"ENSG00000030110","padj":76.8499196,"disease":"EFO_0003958"},
    {"gene":"ENSG00000030110","padj":77.0751059,"disease":"EFO_0003958"},
    {"gene":"ENSG00000030110","padj":66.8525338,"disease":"EFO_0004308"},
    {"gene":"ENSG00000030110","padj":65.023613,"disease":"EFO_0004309"},
    {"gene":"ENSG00000030110","padj":75.800401,"disease":"EFO_0004309"},
    {"gene":"ENSG00000030110","padj":74.5968342,"disease":"EFO_0004309"},
    {"gene":"ENSG00000030110","padj":76.0788143,"disease":"EFO_0004309"},
    {"gene":"ENSG00000030110","padj":74.7536182,"disease":"EFO_0004309"},
    {"gene":"ENSG00000030110","padj":74.0658164,"disease":"EFO_0004309"},
    {"gene":"ENSG00000030110","padj":76.9190252,"disease":"EFO_0004309"},
    {"gene":"ENSG00000030110","padj":78.3358216,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":77.8697729,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":78.1264007,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":77.8321385,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":76.7421961,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":70.6311166,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":76.1401951,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":75.6539583,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":50.7147729,"disease":"EFO_0004309"},{"gene":"ENSG00000030110","padj":50.8592784,"disease":"EFO_0004339"},{"gene":"ENSG00000030110","padj":63.4166658,"disease":"EFO_0004584"},{"gene":"ENSG00000030110","padj":76.9573927,"disease":"EFO_0004842"},{"gene":"ENSG00000030110","padj":76.9190252,"disease":"EFO_0004842"},{"gene":"ENSG00000030110","padj":77.0525515,"disease":"EFO_0004842"},{"gene":"ENSG00000030110","padj":73.7839401,"disease":"EFO_0005088"},{"gene":"ENSG00000030110","padj":71.622622,"disease":"EFO_0005088"},{"gene":"ENSG00000030110","padj":76.9190252,"disease":"EFO_0005090"},{"gene":"ENSG00000030110","padj":59.4459355,"disease":"EFO_0005091"},{"gene":"ENSG00000030110","padj":57.6489747,"disease":"EFO_0006335"},{"gene":"ENSG00000030110","padj":61.7380381,"disease":"EFO_0006336"},{"gene":"ENSG00000030110","padj":51.9904494,"disease":"EFO_0007010"},{"gene":"ENSG00000030110","padj":52.3305416,"disease":"EFO_0007984"},{"gene":"ENSG00000030110","padj":76.9190252,"disease":"EFO_0007985"},{"gene":"ENSG00000030110","padj":78.3358216,"disease":"EFO_0007985"},{"gene":"ENSG00000030110","padj":75.9169817,"disease":"EFO_0007985"},{"gene":"ENSG00000030110","padj":77.3016751,"disease":"EFO_0007985"},{"gene":"ENSG00000030110","padj":77.0751059,"disease":"EFO_0007991"},{"gene":"ENSG00000030110","padj":76.8387377,"disease":"EFO_0007991"},{"gene":"ENSG00000030110","padj":76.8318534,"disease":"EFO_0007994"},{"gene":"ENSG00000030110","padj":76.9883573,"disease":"EFO_0007996"},{"gene":"ENSG00000030110","padj":76.9190252,"disease":"EFO_0009389"},{"gene":"ENSG00000030110","padj":51.8581927,"disease":"EFO_0009554"},{"gene":"ENSG00000030110","padj":73.5525072,"disease":"EFO_1000566"},{"gene":"ENSG00000030110","padj":73.8260031,"disease":"EFO_1000566"}]

  const originNodeId = data[0].gene

  // add nodes
  const nodes = data.map(node => ({
    id: node.disease,
    position: {x: 0, y: 0},
    data: {label: node.disease}
  }))

  nodes.unshift(
    { id: originNodeId,
      position: {x: 0, y: 0},
      data: {label: originNodeId}
    }
  )

  // TODO originNodeId = parameter of function
  const edges = data.map(edge => ({
    id: originNodeId + "-" + edge.disease,
    source: originNodeId,
    target: edge.disease
  }))

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    nodes,
    edges
  );

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow nodes={layoutedNodes} edges={layoutedEdges}> 
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
