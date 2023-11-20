import React, { useState, useContext } from 'react'
import { useReactFlow } from "reactflow";
import { List, Card, Text, ScrollArea, ThemeIcon, Checkbox } from "@mantine/core"
import { onHide } from './onHide';
import { NodesContext } from './GeneGraph';

import shownIcon from './images/eye.png'
import hiddenIcon from './images/eye-closed.png'

// component for sidebar with filter area and list of nodes
export function SidebarFilterList() {

    // get state of nodes from parent component
    const reactflow = useReactFlow()
    const nodes = reactflow.getNodes()

    // states for filter area
    const [genesShown, setGenesShown] = useState(true)
    const [diseasesShown, setDiseasesShown] = useState(true)
    const [drugsShown, setDrugsShown] = useState(true)

    const handleOptionChange = (e) => {

        

    }

    return (
        <div style={{height: '100%', width: '20%' }}>
            <Card withBorder shadow='sm' radius="lg" style={{width: '100%', height: '100%'}}>
                <Card.Section withBorder inheritPadding py="xs">
                    <Card withBorder shadow='sm' radius="lg" style={{width: '100%', height: '50%'}}>
                        <Text weight={700} size="xl" mt="md" style={{textAlign: 'center'}}>Filter</Text>
                        <Checkbox id="boxGenesFilter" label="Show Genes" color="green" style={{padding: "3px"}} checked={genesShown} onChange={(e) => handleOptionChange(e)} />
                        <Checkbox id="boxDiseasesFilter" label="Show Diseases" color="orange" style={{padding: "3px"}} checked={diseasesShown} onChange={(e) => handleOptionChange(e)} />
                        <Checkbox id="boxDrugsFilter" label="Show Drugs" color="red" style={{padding: "3px"}} checked={drugsShown} onChange={(e) => handleOptionChange(e)} />
                    </Card>
                </Card.Section>
                <Card.Section withBorder inheritPadding py="xs">
                    <Card withBorder shadow='sm' radius="lg" style={{width: '100%', height: '50%'}}>
                        <Text weight={700} size="xl" mt="md" style={{textAlign: 'center'}}>Nodes</Text>
                        <ScrollArea h={250} type="scroll" offsetScrollbars scrollbarSize={4} style={{border: '2px solid black', borderRadius: '10px', padding: '10px'}}>
                            <List>
                                {nodes.map((node) => (
                                    <List.Item 
                                        id={node.id} 
                                        icon={
                                            <ThemeIcon color='white' size="xs" radius="xl">
                                                <img
                                                    id={node.id + "_icon"}
                                                    style={{ width: '15px', height: '15px'}}
                                                    color='white'
                                                    src={shownIcon}
                                                    onClick={() => onHide(reactflow, node.id)}
                                                />
                                            </ThemeIcon>
                                        }
                                    >
                                        {node.data?.label}
                                    </List.Item>
                                ))}
                            </List>
                        </ScrollArea>
                    </Card>
                </Card.Section>
            </Card>
        </div>
    )
}