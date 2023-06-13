import React from 'react';
import {Handle, Node, NodeProps, Position} from 'reactflow';


const style= { border: "1px solid #777", padding: 20, borderRadius:100 }


function GeneNode({ data }: NodeProps) {
  return <>
  <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }}/>
  <div style={style}>{data?.label}</div>
  <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }}/>
  </>
}

export default GeneNode