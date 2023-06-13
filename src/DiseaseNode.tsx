import React from 'react';
import {Node, NodeProps} from 'reactflow';

type NodeData = {
  "id": string,
  "name":string
};

type GeneNode = Node<NodeData>;

function GeneNode({ data }: NodeProps<NodeData>) {
  return <div>{data.name}</div>;
}

export default GeneNode