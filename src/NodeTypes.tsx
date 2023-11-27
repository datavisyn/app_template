import { Tabs, Text, Button, HoverCard, Flex, Space } from '@mantine/core';
import React, { useState } from "react"
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import { useGetTraitInfo } from './store/store';
import { useEffect } from 'react';
import { IconInfoCircle, IconReportSearch, IconTopologyFull } from '@tabler/icons-react';


var color = {
    "gene": "#4BB268",
    "disease": "#FF964D",
    "drug": "#B42865"
};


// this is the default custom node
function DefaultCustomNode({ data }) {
    const reactflow = useReactFlow();
    const nodeId = useNodeId();
    const [collapsed, setCollapsed] = useState(true);

    const [nodeData, setNodeData] = useState(data);

    const { data: traitInfo, isFetching } = data.type == "disease" ? useGetTraitInfo({ traitId: data?.label }) : { data: {}, isFetching: false };


    useEffect(() => {
        if (!isFetching) {
            setNodeData(Object.assign({}, data, traitInfo));
            data.summary = traitInfo?.summary;
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
        <HoverCard shadow="md" width={400} withinPortal={true}>
            <HoverCard.Target>
                <div style={nodeStyle}>
                    <div>{data?.label}</div>
                    <Handle type="source" position={Position.Top} style={{ visibility: "hidden" }} />
                    <Handle type="target" position={Position.Right} style={{ visibility: "hidden" }} />
                </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Flex justify="center" gap="md">
                    <Button variant="filled" color="gray" fullWidth> {collapsed ? "Expand" : "Collapse"}</Button>
                    <Button variant="filled" color="gray" fullWidth onClick={() => onHide()}>Hide</Button>
                </Flex>
                <Space h="md" />
                <Tabs color="gray" variant="outline" defaultValue="details">
                    <Tabs.List>
                        <Tabs.Tab rightSection={<IconInfoCircle/>} value="details" > Details</Tabs.Tab>
                        <Tabs.Tab rightSection={<IconReportSearch/>} value="summary">Summary</Tabs.Tab>
                        <Tabs.Tab rightSection={<IconTopologyFull/>} value="structure">Structure</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="details">
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
                    </Tabs.Panel>
                    <Tabs.Panel value="summary">
                        <Text size="md" fw={700}>Summary</Text>
                        <Text size="sm">{data?.summary}</Text>
                    </Tabs.Panel>
                    <Tabs.Panel value="structure">
                        <Text>MolStar Structure</Text>
                    </Tabs.Panel>
                </Tabs>
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