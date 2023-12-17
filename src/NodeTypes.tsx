import { Tabs, Text, Button, Flex, Space, ScrollArea, CloseButton, Title } from '@mantine/core';


import { Popover } from '@mantine/core';
import React, { useState } from "react"
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import { useGetTraitInfo } from './store/store';
import { useEffect } from 'react';
import { onNodesVisibilityChange } from './onNodesVisibilityChange';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';

var color = {   
    "gene": "#4BB268",
    "disease": "#FF964D",
    "drug": "#B42865"
};


// this is the default custom node
function DefaultCustomNode({ data }) {
    const reactflow = useReactFlow();
    const nodes = reactflow.getNodes();
    const nodeId = useNodeId();
    const [collapsed, setCollapsed] = useState(true);

    const [nodeData, setNodeData] = useState(data?.displayProps);

    const { data: traitInfo, isFetching } = data.type == "disease" ? useGetTraitInfo({ traitId: data?.label }) : { data: {}, isFetching: false };

    const nodeIndex = nodes.findIndex(n => n.id === nodeId)


    useEffect(() => {
        if (!isFetching) {
            setNodeData(Object.assign(data?.displayProps, traitInfo));
        }

    }, [isFetching]);
    function onExpandCollapse(){
        if(collapsed){
            data?.onExpand(nodeId)
            setCollapsed(false);
        }
        else{

        }
    }
    

    // style applied for every node
    const nodeStyle = {
        backgroundColor: color[data?.type],
        color: "black",
        padding: "14px",
        borderRadius: "8px",
        border: data?.isRoot ? '3px solid #398354' : '',
        // boxShadow: isHovered || isHighlighted ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
        // transition: "box-shadow 0.3s ease transform 0.3 ease",
        // transform: selected ? "scale(1.8)" : "scale(1)",
        // display: nodeInternals.get(data.id).hidden ? "none" : "block",
    };

    const symbolStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
    };

    const [popoverOpen, setPopoverOpen] = useState(false);

    const openPopover = () => {
      setPopoverOpen(true);
    };
  
    const closePopover = () => {
      setPopoverOpen(false);
      console.log("close");
    };

    const label = data?.isRoot ? <b>{data?.displayProps.label}</b> : data?.displayProps.label

    const iconClose = <InfoOutlinedIcon fontSize='small' />;

    return (
        <Popover shadow="md" width={358} zIndex={100} withinPortal={true} opened={popoverOpen}>
            <Popover.Target>
                <div style={nodeStyle} onClick={openPopover}>
                    <Handle type="source" position={Position.Top} style={{ visibility: "hidden" }} />
                    {label}
                    <Handle type="target" position={Position.Right} style={{ visibility: "hidden" }} />
                    {data?.isRoot && <div style={symbolStyle}> <SearchIcon  style={{fill: "black" , borderRadius: 100}} /> </div>}
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <Flex justify="center" gap="md">
                    <Button variant="filled" color="gray" fullWidth onClick={onExpandCollapse}> {collapsed ? "Expand" : "Collapse"}</Button>
                    <Button variant="filled" color="gray" fullWidth onClick={() => onNodesVisibilityChange(reactflow, [nodes[nodeIndex]], !nodes[nodeIndex].hidden)}>Hide</Button>
                    <CloseButton  onClick={closePopover}/>
                </Flex>
        
                <Space h="md" />
                <Tabs color="gray" variant="outline" defaultValue="details">
                    <Tabs.List>
                        <Tabs.Tab rightSection={<InfoOutlinedIcon fontSize='small' />} value="details" > Details</Tabs.Tab>
                        {data?.displayProps.summary != "nan" ? <Tabs.Tab rightSection={<PlagiarismOutlinedIcon fontSize='small'/>} value="summary">Summary</Tabs.Tab> : <></>}
                        <Tabs.Tab rightSection={<InsightsIcon fontSize='small'/>} value="structure">Structure</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="details" >
                        <ScrollArea>
                            <div style={{ height: '30vh' }}>
                                {Object.keys(nodeData).map((key: string, index: number) => {
                                    if (nodeData[key] != "nan") {
                                        if (key === "synonyms") {
                                            if (nodeData[key].length > 0) {
                                                return (
                                                    <div key={index}>
                                                        <Text size="md" fw={700}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                                        <Text size="sm">{renderSynonymsWithDashes(nodeData[key])}</Text>
                                                    </div>
                                                )
                                            }
                                        }
                                        else if (key != "summary") {
                                            return (
                                                <div key={index}>
                                                    <Text size="md" fw={700}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                                    <Text size="sm">{nodeData[key]}</Text>
                                                </div>
                                            );
                                        }
                                    }
                                })}
                            </div>
                        </ScrollArea>
                    </Tabs.Panel>
                    <Tabs.Panel value="summary">
                        <ScrollArea>
                            <div style={{ height: '30vh' }}>
                                <Text size="sm" fw={700}>Summary</Text>
                                <Text size="sm">{data?.displayProps.summary}</Text>
                            </div>
                        </ScrollArea>

                    </Tabs.Panel>

                    <Tabs.Panel value="structure">
                        <div style={{ height: '30vh' }}>
                            <Text>MolStar Structure</Text>
                        </div>
                    </Tabs.Panel>
                </Tabs>
            </Popover.Dropdown>
        </Popover>
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