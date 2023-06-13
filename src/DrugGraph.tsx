import React from 'react';
import { useGene2Drugs } from './store/store';
import { ReactFlow, Background, Controls, MiniMap, Node } from 'reactflow';
import 'reactflow/dist/style.css';

type DrugGraphProps={
  geneID:string
}

const radius = 200
const center = {x: 0, y: 0}
const repulstionForce = 20
const nodeSize = 50

function layoutGraph(nodes: Array<Node>) {

  // compute angle between nodes
  const angleStep = 360 / nodes?.length

  // assign position
  nodes?.forEach((node, index) => {
    if (index == 0) {
      node.position = center
    }
    else {

      // compute angle
      const angle = index * angleStep

      // assign new position
      node.position.x = center.x + radius * Math.cos(angle)
      node.position.y = center.y + radius * Math.sin(angle)
    }
  })

  // prevent nodes from overlapping
  let overlapping: Boolean = true;

  while (overlapping) {
    overlapping = false

    nodes?.forEach((node, index) => {
      // one node ahead
      for (let i = index + 1; i < nodes?.length; ++i) {
        
        const nodeAhead = nodes[i]
        const dx = nodeAhead.position.x - node.position.x
        const dy = nodeAhead.position.y - node.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        const minDist = repulstionForce + nodeSize / 2 + nodeSize / 2

        if (distance < minDist) {
          overlapping = true

          const force = repulstionForce / distance
          const fx = force * dx / distance;
          const fy = force + dy / distance;

          node.position.x -= fx
          node.position.y -= fy

          nodeAhead.position.x += fx 
          nodeAhead.position.y += fy

        }
      }
    })
  }
}

export function DrugGraph(props:DrugGraphProps) {

  // get drugs for given gene
  const { data: graph } = useGene2Drugs({
    gene: props.geneID || undefined,
    limit: 1000,
  });

  // add nodes
  const nodes = graph?.map(node => ({
    id: node.disease,
    position: {x: Math.random(), y: Math.random()},
    data: {
            label: node.disease,
            score: node.padj
          }
  }))

  // add origin of nodes
  nodes?.unshift(
    { id: props.geneID,
      position: {x: 0, y: 0},
      data: {
              label: props.geneID,
              score: graph[0]?.padj
            }
    }
  )

  // add edges
  const edges = graph?.map(edge => ({
    id: props.geneID + "-" + edge.disease,
    source: props.geneID,
    target: edge.disease
  }))

  layoutGraph(nodes)

  return (
    <div style={{ height: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges}> 
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

