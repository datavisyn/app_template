import React, { useState } from "react"
import { Handle, Position } from "reactflow"


// this is the default custom node
const DefaultCustomNode = ({ data, backgroundColor }) => {

    // state for hovering effect
    const [isHovered, setIsHovered] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    // const [isHidden, setIsHidden] = useState(false);

    // function onHide() {
    // }

    // style applied for every node
    const nodeStyle = {
        backgroundColor,
        color: "black",
        padding: "14px",
        borderRadius: "8px",
        boxShadow: isHovered || isHighlighted ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
        transition: "box-shadow 0.3s ease transform 0.3 ease",
        transform: isHighlighted ? "scale(1.8)" : "scale(1)",
    };

    return (
        <div style={nodeStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHighlighted(!isHighlighted)}>
            <div>{data?.label}</div>
            <Handle type="source" position={Position.Top}style={{ visibility: "hidden" }} />
            <Handle type="target" position={Position.Right} style={{ visibility: "hidden" }} />
        </div>
    );
}

// this node is used for genes
const GeneNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"#4BB268"} />
}

// this node is used for diseases
const DiseaseNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"#FF964D"} /> 
}

// this node is used for drugs
const DrugNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"#B42865"} />
}

// these node types can be used in the graph
export const nodeTypes = {
    gene: GeneNode,
    disease: DiseaseNode,
    drug: DrugNode
};