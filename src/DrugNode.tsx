import React from 'react';
import {Node, NodeProps} from 'reactflow';

type NodeData = {
  "id": string,
  "name":string
};

type DrugNode = Node<NodeData>;

function DrugNode({ data }: NodeProps<NodeData>) {
  return <div>{data.name}</div>;
}

export default DrugNode