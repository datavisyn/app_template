import { Text, Button, HoverCard, Flex, } from '@mantine/core';
import React from "react"
import { Handle, Position, useNodeId, useReactFlow } from "reactflow"
import { onHide } from './onHide';

// this is the default custom node
function DefaultCustomNode({ data, selected, backgroundColor }) {
    const reactflow = useReactFlow();
    const nodeId = useNodeId();

    // style applied for every node
    const nodeStyle = {
        backgroundColor,
        color: "black",
        padding: "14px",
        borderRadius: "8px",
        border: data?.isRoot ? '3px solid #398354' : ''
        // boxShadow: isHovered || isHighlighted ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
        // transition: "box-shadow 0.3s ease transform 0.3 ease",
        // transform: selected ? "scale(1.8)" : "scale(1)",
        // display: nodeInternals.get(data.id).hidden ? "none" : "block",
    };

    const label = data?.isRoot ? <b>{data?.label}</b> : data?.label

    return (

        <HoverCard shadow="md" width={400}>
            <HoverCard.Target>
                <div style={nodeStyle}>
                    <Handle type="source" position={Position.Top} style={{ visibility: "hidden" }} />
                    {label}
                    <Handle type="target" position={Position.Right} style={{ visibility: "hidden" }} />
                </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Flex justify="center">
                    <Button color="gray">CollapseExpand</Button>
                    <Button color="gray" onClick={() => onHide(reactflow, nodeId)}>Hide</Button>
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