import { Tabs, Text, Button, Flex, Space, ScrollArea, Popover } from '@mantine/core';
import React, { useState } from "react"
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import { useGetTraitInfo } from './store/store';
import { useEffect } from 'react';
import { onNodesVisibilityChange } from './onNodesVisibilityChange';
import MolViewer from './MolViewer';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { median } from 'd3';
import { height } from '@mui/system';

var color = {   
    "gene": "#4BB268",
    "disease": "#FF964D",
    "drug": "#B42865"
};


// this is the default custom node
function DefaultCustomNode({ data, selected }) {
    const reactflow = useReactFlow();
    const nodes = reactflow.getNodes();
    const nodeId = useNodeId();
    const [collapsed, setCollapsed] = useState(!data?.isRoot);

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
            setCollapsed(false)
        }
        else{
            var realChildren = (data?.children).filter(childId => !data?.parents.includes(childId))
            data?.onCollapse(nodeId, realChildren)
            setCollapsed(true)
        }
    }
    

    // style applied for every node
    const nodeStyle = {
        backgroundColor: color[data?.type],
        color: "black",
        padding: "14px",
        borderRadius: "8px",
        border: data?.isRoot ? '3px solid #398354' : '',
        opacity: selected? 1 : 0.5,
    };

    const symbolStyle: React.CSSProperties = {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
    };

    const [popoverOpen, setPopoverOpen] = useState(false);

    const openPopover = () => {
        setPopoverOpen(prev => !prev);
      };
  
    const closePopover = () => {
      setPopoverOpen(false);
    };

    const label = data?.isRoot ? <b>{data?.displayProps.label}</b> : data?.displayProps.label

    return (
        <Popover trapFocus shadow="md" width={358} opened={popoverOpen} position="bottom" withinPortal >
            <Popover.Target>
                <div style={nodeStyle} onClick={openPopover} >
                    <Handle type="source" position={Position.Top} style={{ visibility: "hidden" }} />
                    {label}
                    <Handle type="target" position={Position.Right} style={{ visibility: "hidden" }} />
                    {data?.isRoot && <div style={symbolStyle}> <SearchIcon  style={{fill: "black" , borderRadius: 100}} /> </div>}
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <Flex justify="center" gap="md">
                    <Button variant="filled" color="gray" fullWidth onClick={onExpandCollapse}> {data?.isRoot ? "Collapse" : "Expand"}</Button>
                    <Button variant="filled" color="gray" fullWidth onClick={() => onNodesVisibilityChange(reactflow, [nodes[nodeIndex]], !nodes[nodeIndex].hidden)}>Hide</Button>
                    <Button onClick={closePopover} color='red'  ><CloseIcon /></Button>
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
                        <ScrollArea>
                            <div style={{ height: '30vh' }}>
                                <MolViewer entrez_id={nodeId} options={{ layoutShowControls: false }} />
                            </div>
                        </ScrollArea>
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