import React, { useState, useContext } from "react"
import { Handle, Position, useNodeId, useStore, useStoreApi, useUpdateNodeInternals, useReactFlow  } from "reactflow"
import { GraphNodesContext } from "./GeneGraph";

// this is the default custom node
function DefaultCustomNode ({ data, selected, backgroundColor }) {
    // const store = useStoreApi();
    // const { nodeInternals } = store.getState();
    const reactflow = useReactFlow();
    const nodeId = useNodeId();
    
    // state for hovering effect
    const [isHovered, setIsHovered] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    // const [isHidden, setIsHidden] = useState(false);

    function onHide() {

        reactflow.setNodes(reactflow.getNodes().map((node) => {
            if (node.id === nodeId) {
                return { ...node, hidden: true };
            }
            return node;
        }));

        reactflow.setEdges(reactflow.getEdges().map((edge) => {
            if (edge.source === nodeId || edge.target === nodeId) {
                return { ...edge, hidden: true };
            }
            return edge;
        }));

    }

    // style applied for every node
    const nodeStyle = {
        backgroundColor,
        color: "black",
        padding: "14px",
        borderRadius: "8px",
        boxShadow: isHovered || isHighlighted ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
        transition: "box-shadow 0.3s ease transform 0.3 ease",
        transform: selected ? "scale(1.8)" : "scale(1)",
        // display: nodeInternals.get(data.id).hidden ? "none" : "block",
    };

    return (
        <div style={nodeStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
            // onClick={() => setIsHighlighted(true)}
            >
            <button onClick={() => onHide()}>Hide</button>
            <div>{data?.label}</div>
            <Handle type="source" position={Position.Top}style={{ visibility: "hidden" }} />
            <Handle type="target" position={Position.Right} style={{ visibility: "hidden" }} />
        </div>
    );
}

// this node is used for genes
const GeneNode = ({ data, selected }) => {
    return <DefaultCustomNode data={data} selected={selected} backgroundColor={"#4BB268"} />
}

// this node is used for diseases
const DiseaseNode = ({ data, selected}) => {
    return <DefaultCustomNode data={data} selected={selected} backgroundColor={"#FF964D"} /> 
}

// this node is used for drugs
const DrugNode = ({ data, selected}) => {
    return <DefaultCustomNode data={data} selected={selected} backgroundColor={"#B42865"} />
}

// these node types can be used in the graph
export const nodeTypes = {
    gene: GeneNode,
    disease: DiseaseNode,
    drug: DrugNode
};