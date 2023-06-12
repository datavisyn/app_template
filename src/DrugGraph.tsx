import React, { useEffect, useRef } from 'react';
import dagre from 'dagre';
import { useAutocomplete,useGene2Drugs, useGene2Genes } from './store/store';
import { ReactFlow, Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

const nodeWidth = 172;
const nodeHeight = 36;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges) => {

    dagreGraph.setGraph({ rankdir: 'TB',align: 'UL' })

    nodes?.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges?.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre?.layout(dagreGraph);

    nodes?.forEach((node) => {

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


type DrugGraphProps={
    geneID:string
}

type diseaseType = {
    gene: string
    padj: number
    disease: string
}

export function DrugGraph(props:DrugGraphProps) {

  const { data: graph } = useGene2Drugs({
    gene: props.geneID || undefined,
    limit: 1000,
  });


  // add nodes
  const nodes = graph?.map(node => ({
    id: node.disease,
    position: {x: 0, y: 0},
    data: {label: node.disease}
  }))

  nodes?.unshift(
    { id: props.geneID,
      position: {x: 0, y: 0},
      data: {label: props.geneID}
    }
  )

  // TODO originNodeId = parameter of function
  const edges = graph?.map(edge => ({
    id: props.geneID + "-" + edge.disease,
    source: props.geneID,
    target: edge.disease
  }))

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    nodes,
    edges
  );


  return (
    <div style={{ height: '100%' }}>
      <ReactFlow nodes={layoutedNodes} edges={layoutedEdges} > 
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

