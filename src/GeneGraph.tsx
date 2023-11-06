import React, { useState, useEffect, useMemo } from 'react';

import {useExpand} from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from "./NodeTypes"

// Props for the GeneGraph component
type GeneGraphProps = {
  geneID: string;
};

// GeneGraph component
export function GeneGraph(props: GeneGraphProps) {
  // State for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // get all genes that are connected to the first node
  const { data: graph } = useExpand({
      geneIds: [props.geneID],
      options: [true],
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
        type:node.type.toString()
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
