import React from "react"
import { Handle, Position } from "reactflow"

// this node is used for genes
const GeneNode = ({ data }) => {
    return (
        <div style={{ backgroundColor: "#800080", padding: "14px", borderRadius: "50px" }}>
            <Handle type="target" position={Position.Top} style={{visibility: 'hidden'}}/>
            <div>{data?.label}</div>
            <Handle type="source" position={Position.Bottom} style={{visibility: 'hidden'}}/>
        </div>
    )
}

// this node is used for traits
const TraitNode = ({ data }) => {
    return (
        <div style={{ backgroundColor: "#ff9800", padding: "14px", borderRadius: "50px" }}>
            <Handle type="target" position={Position.Top} style={{visibility: 'hidden'}}/>
            <div>{data?.label}</div>
            <Handle type="source" position={Position.Bottom} style={{visibility: 'hidden'}}/>
        </div>
    )
}

// this node is used for drugs
const DrugNode = ({ data }) => {
    return (
        <div style={{ backgroundColor: "#0074e4", padding: "14px", borderRadius: "50px" }}>
            <Handle type="target" position={Position.Top} style={{visibility: 'hidden'}}/>
            <div>{data?.label}</div>
            <Handle type="source" position={Position.Bottom} style={{visibility: 'hidden'}}/>
        </div>
    )
}

export const nodeTypes = {
    gene: GeneNode,
    trait: TraitNode,
    drug: DrugNode
};