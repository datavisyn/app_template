import { Text, Button, HoverCard, Flex } from '@mantine/core';
import React, { useState } from "react"
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import { useGetTraitInfo } from './store/store';
import { useEffect } from 'react';


var color = {
    "gene": "#4BB268",
    "disease": "#FF964D",
    "drug": "#B42865"
};

// this is the default custom node
function DefaultCustomNode({ data }) {
    const reactflow = useReactFlow();
    const nodeId = useNodeId();
    const [isHighlighted, setIsHighlighted] = useState(false);
    const label = data?.label;

    const [nodeData, setNodeData] = useState(data);

    const { data: traitInfo, isFetching } = data.type == "disease" ? useGetTraitInfo({traitId:label}) : { data: {}, isFetching: false };


    useEffect(() => {
        if (!isFetching) {
            setNodeData(Object.assign({}, data, traitInfo));
        }

    }, [isFetching]);

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

    /*     function test(){
            if(data.type == "disease"){
                Object.assign({}, data, traitInfo);
            }
        } */

    // style applied for every node
    const nodeStyle = {
        backgroundColor: color[data?.type],
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

                {Object.keys(nodeData).map((key: string, index: number) => {
                    if (nodeData[key] != "nan") {
                        if (key === "synonyms") {
                            if (data[key].length > 0) {
                                return (
                                    <div key={index}>
                                        <Text size="md" fw={700}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                        <Text size="sm">{renderSynonymsWithDashes(nodeData[key])}</Text>
                                    </div>
                                )
                            }
                        }
                        else if (key != "summary" && key != "type") {
                            return (
                                <div key={index}>
                                    <Text size="md" fw={700}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                    <Text size="sm">{nodeData[key]}</Text>
                                </div>
                            );
                        }
                    }

                })}
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

/* // this node is used for genes
const GeneNode = ({ data, id, type }) => {
    return <DefaultCustomNode data={data} nodeId={id} />
}

// this node is used for diseases
const DiseaseNode = ({ data, id }) => {
    return <DefaultCustomNode data={data} nodeId={id} backgroundColor={"#FF964D"} />
}

// this node is used for drugs
const DrugNode = ({ data, id }) => {
    return <DefaultCustomNode data={data} nodeId={id} backgroundColor={"#B42865"} />
} */

// these node types can be used in the graph
export const nodeTypes = {
    node: DefaultCustomNode,
};