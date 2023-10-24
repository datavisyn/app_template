import React, { useState, useEffect, useMemo } from 'react';

import {useGene2All} from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from "./NodeTypes"

const maxNodesPerCircle = 20;

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
  //const { data: firstNode } = useSingleGene({ gene: props.geneID });

  // get all genes that are connected to the first node
  const { data: graph } = useGene2All({
    gene: props.geneID || undefined,
    limit: 1000,
  });

  useMemo(() => {


    setNodes(graph?.nodes.map((node,index)=>{
      return{
        id:node.id,
        position:{
          x:node.position.x*1200,
          y:node.position.y*500
        },
        data:{
          label:node.id
        },
        // type:node.type.toString()
      }
    }));
    
    setEdges(
      graph?.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      }))
    );

  },[graph]);



return (
  <div style={{ height: '90%' }}>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  </div>
);
}
