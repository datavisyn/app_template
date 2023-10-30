import React, { useState } from "react"
import { Handle, Position } from "reactflow"


// this is the default custom node
const DefaultCustomNode = ({ data, backgroundColor }) => {

    // state for hovering effect
    const [isHovered, setIsHovered] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    function onHide() {
        setIsHidden(true)
    }

    // style applied for every node
    const nodeStyle = {
        backgroundColor,
        color: "black",
        padding: "14px",
        borderRadius: "8px",
        boxShadow: isHovered ? "0 2px 6px rgba(0, 0, 0, 0.2)" : "none",
        transition: "box-shadow 0.3s ease transform 0.3 ease",
        transform: isHighlighted ? "scale(1.8)" : "scale(1)",
        display: isHidden ? "none" : "block"
    };

    return (
        <div style={nodeStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsHighlighted(!isHighlighted)}>
            <div>{data?.label}</div>
            <Handle type="source" position={Position.Top} id="a" style={{ visibility: "hidden" }} />
            <Handle type="source" position={Position.Right} id="b" style={{ visibility: "hidden" }} />
            <Handle type="source" position={Position.Bottom} id="c" style={{ visibility: "hidden" }} />
            <Handle type="source" position={Position.Left} id="d" style={{ visibility: "hidden" }} />
        </div>
    );
}

// this node is used for genes
const GeneNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"red"} />
}

// this node is used for diseases
const DiseaseNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"blue"} />
}

// this node is used for drugs
const DrugNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"orange"} />
}

// these node types can be used in the graph
export const nodeTypes = {
    gene: GeneNode,
    disease: DiseaseNode,
    drug: DrugNode
};