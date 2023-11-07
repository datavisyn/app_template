import { Text, Button, HoverCard, Group, Flex } from '@mantine/core';
import React, { useState, useContext } from "react"
import { Handle, Position, useNodeId, useReactFlow } from "reactflow"

// this is the default custom node
function DefaultCustomNode({ data, selected, backgroundColor }) {
    const reactflow = useReactFlow();
    const nodeId = useNodeId();
    const [isHighlighted, setIsHighlighted] = useState(false);

    function onHide() {

        reactflow.setNodes(reactflow.getNodes().map((node) => {
            if (node.id === nodeId) {
                return { ...node, hidden: true };
            }
            return node;
        }));

        console.log(reactflow.getNode(nodeId).hidden)

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
        // boxShadow: isHovered || isHighlighted ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
        // transition: "box-shadow 0.3s ease transform 0.3 ease",
        // transform: selected ? "scale(1.8)" : "scale(1)",
        // display: nodeInternals.get(data.id).hidden ? "none" : "block",
    };

    return (

        <HoverCard shadow="md" width={400}>
            <HoverCard.Target>
                <div style={nodeStyle}>
                    <div>{data?.label}</div>
                    <Handle type="source" position={Position.Top} style={{ visibility: "hidden" }} />
                    <Handle type="target" position={Position.Right} style={{ visibility: "hidden" }} />
                </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Flex justify="center">
                    <Button color="gray">CollapseExpand</Button>
                    <Button color="gray" onClick={() => onHide()}>Hide</Button>
                </Flex>
                <Text size="lg" fw={700}>Details</Text>
                <Text size="md" fw={700} >Full Name</Text>
                <Text size="sm">{data?.fullname}</Text>
                <Text size="md" fw={700}>Synonyms</Text>
                <div>{renderSynonymsWithDashes(data?.synonyms)}</div>
                <Text size="md" fw={700}>EntrezID</Text>
                <Text size="sm">{data?.entrezId}</Text>
                <Text size="md" fw={700}>Summary</Text>
                <Text size="sm">{data?.summary}</Text>
            </HoverCard.Dropdown>
        </HoverCard>
    );
}

function renderSynonymsWithDashes(synonyms) {
    if (!synonyms || synonyms.length === 0) {
        return null; // Return null if there are no synonyms
    }

    return (
        <Text size="sm">
            {synonyms.map((synonym, index) => (
                <span key={index}>
                    {synonym}
                    {index < synonyms.length - 1 && ", "} {/* Add a hyphen if it's not the last element */}
                </span>
            ))}
        </Text>
    );
}

// this node is used for genes
const GeneNode = ({ data, selected }) => {
    return <DefaultCustomNode data={data} selected={selected} backgroundColor={"#4BB268"} />
}

// this node is used for diseases
const DiseaseNode = ({ data, selected }) => {
    return <DefaultCustomNode data={data} selected={selected} backgroundColor={"#FF964D"} />
}

// this node is used for drugs
const DrugNode = ({ data, selected }) => {
    return <DefaultCustomNode data={data} selected={selected} backgroundColor={"#B42865"} />
}

// these node types can be used in the graph
export const nodeTypes = {
    gene: GeneNode,
    disease: DiseaseNode,
    drug: DrugNode
};