import React, {useState} from "react"
import { Handle, Position } from "reactflow"

// this is the default custom node
const DefaultCustomNode = ({ data, backgroundColor }) => {

    // state for hovering effect
    const [isHovered, setIsHovered] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    // style applied for every node
    const nodeStyle = {
        backgroundColor,
        color: "black",
        padding: "14px",
        borderRadius: "8px",
        boxShadow: isHovered ? "0 2px 6px rgba(0, 0, 0, 0.2)" : "none",
        transition: "box-shadow 0.3s ease transform 0.3 ease",
        transform: isHighlighted ? "scale(1.8)" : "scale(1)",
    };

    return (
        <div style={nodeStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} 
                onClick={() => setIsHighlighted(!isHighlighted)}>
            <Handle type="target" position={Position.Top} style={{visibility: "hidden"}} />
            <div>{data?.label}</div>
            <Handle type="source" position={Position.Bottom} style={{visibility: "hidden"}} />
        </div>
    );
}

// this node is used for genes
const GeneNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"#8BB4D9"} />
}

// this node is used for diseases
const DiseaseNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"#D5E5F2"} /> 
}

// this node is used for drugs
const DrugNode = ({ data }) => {
    return <DefaultCustomNode data={data} backgroundColor={"#91BDD9"} />
}

// these node types can be used in the graph
export const nodeTypes = {
    gene: GeneNode,
    disease: DiseaseNode,
    drug: DrugNode
};