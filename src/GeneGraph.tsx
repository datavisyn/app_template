import React, { useState, useEffect, useMemo, createContext, useContext, useReducer } from 'react';
import { useAutocomplete, useGene2Drugs, useGene2Genes, useSingleGene } from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Handle, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from "./NodeTypes";

// context for nodes state
import SimpleFloatingEdge from './EdgeType';

const maxNodesPerCircle = 20;
const edgeTypes = {
  floating: FloatingEdge, 
};


// Function to get the center of the screen
const getScreenCenterCoordinates = () => {
  const { innerWidth, innerHeight } = window;
  const centerX = Math.floor(innerWidth / 2);
  const centerY = Math.floor(innerHeight / 2);
  // log coordinates to console
  console.log(centerX, centerY);
  return { x: centerX, y: centerY };
};

// Funktion zur Konvertierung von Polarkoordinaten in kartesische Koordinaten
const polarToCartesian = (angle, radius, center) => {
  const x = center.x + radius * Math.cos(angle);
  const y = center.y + radius * Math.sin(angle);
  return { x, y };
};

// Props for the GeneGraph component
type GeneGraphProps = {
  geneID: string;
};

// GeneGraph component
export function GeneGraph(props: GeneGraphProps) {

  // State for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // continue if gene with that id exists
  const { data: firstNode } = useSingleGene({ gene: props.geneID });

  // get all genes that are connected to the first node
  const { data: graph } = useGene2Genes({
    gene: props.geneID || undefined,
    limit: 1000,
  });

  useEffect(() => {
    if (!graph || !firstNode) return;

    // add first node to graph
    const allNodes = graph.concat(firstNode);
    const firstNodeId = firstNode[0]?.ENSG_B;
    const nodesCircleAmount = allNodes.length < maxNodesPerCircle ? allNodes.length - 1 : maxNodesPerCircle;
    const angleStep = (2 * Math.PI) / nodesCircleAmount;
    const center = getScreenCenterCoordinates();
    let radius = 250;

    setNodes(
      allNodes.map((node, index) => {
        if (node.ENSG_B === firstNodeId) {
          return {
            id: node.ENSG_B,
            position: center,
            type: "gene",
            hidden: false,
            data: {
              label: node.ENSG_A === firstNode[0]?.ENSG_A ? node.ENSG_B_name : node.ENSG_A_name,
            },
          };
        } else {
          if (index % maxNodesPerCircle === 0) {
            radius += 200;
          }
          const angle = (index - 1) * angleStep;
          const position = polarToCartesian(angle, radius, center);
          return {
            id: node.ENSG_B,
            position: position,
            type: "gene",
            hidden: false,
            data: {
              label: node.ENSG_A === firstNode[0]?.ENSG_A ? node.ENSG_B_name : node.ENSG_A_name,
            }
          };
        }
      })
    );

    setEdges(
      allNodes
        .filter(edge => edge.ENSG_A !== edge.ENSG_B)
        .map((edge) => ({
          id: edge.ENSG_A + '-' + edge.ENSG_B,
          source: edge.ENSG_A,
          target: edge.ENSG_B,
          type: 'floating',
        }))
    );

  }, [graph]);



  return (
    <div style={{ height: '100%', width: '85%' }}>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineComponent={FloatingConnectionLine}
      >
        <Background />
        <Controls />
        <MiniMap />
        <div style={{ minHeight: '100%', width: '15%' }}>
              <FilterNodeTypesArea />
            </div>

      </ReactFlow>
    </div>
  );
}