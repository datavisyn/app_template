import React, { useState, useEffect, } from 'react'
import { useReactFlow, useOnSelectionChange } from "reactflow";
import { Card, ScrollArea, Group, Divider, MultiSelect } from "@mantine/core"
import { onNodesVisibilityChange } from './onNodesVisibilityChange';
import { TreeView } from '@mui/x-tree-view';
import { TreeItem } from '@mui/x-tree-view';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { onNodesSelectionChange } from './onNodesSelectionChange';

const theme = createTheme({
    components: {
        MuiTreeView: {
            styleOverrides: {
                root: {
                    backgroundColor: 'white',
                },
            },
        },
    },
});



// component for sidebar with filter area and list of nodes
export function SidebarFilterList() {

    // get state of nodes from parent component
    const reactflow = useReactFlow();
    const nodes = reactflow.getNodes();
    const [nodesSelected, setNodesSelected] = useState(nodes.filter(node => node.selected));
    const [searchSelected, setSearchSelected] = useState([]);

    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            console.log("nodes", nodes)
            setNodesSelected(nodes.filter(node => node.selected))
        },
        
    });


    const NodeTree = () => {

        const geneNodeLabels = nodes.filter(node => node.data.type === 'gene').map(node => node.data.displayProps.label);

        const diseaseNodeLabels = nodes.filter(node => node.data.type === 'disease').map(node => {
            return node.data.displayProps.label;
        });

        const drugNodeLabels = nodes.filter(node => node.data.type === 'drug').map(node => node.data.displayProps.label);

        const nodeLists = [geneNodeLabels, diseaseNodeLabels, drugNodeLabels]
        const types = ["genes", "diseases", "drugs"]

        const [treeViewSelection, setTreeViewSelection] = useState(nodesSelected.map(node => node.data?.label + "_treeItem"));


        useEffect(() => {
            setTreeViewSelection(nodesSelected.map(node => node.data?.label + "_treeItem"))

        }, [nodesSelected])

        return (
            <ThemeProvider theme={theme}>
                <TreeView
                    multiSelect={true}
                    aria-aria-label='node_tree'
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    selected={treeViewSelection}
                >
                    {
                        nodeLists.map((list, index) => {
                            if (list.length > 0) return (
                                <TreeItem nodeId={'listNode_' + types[index]} label={types[index]}>
                                    {list.map((label) => {
                                        return <TreeItem nodeId={label + "_treeItem"} label={label} />
                                    })}
                                </TreeItem>)
                        })
                    }
                </TreeView>
            </ThemeProvider>
        )
    }

    const scrollHeight = document.getElementById('card')?.clientHeight - 100

    const handleSelectedChange = (values) => {
        var selected = nodes.filter(node => values.includes(node.data?.label))
        onNodesSelectionChange(reactflow, selected)
    }

    return (
        <div style={{ width: '23%', padding: '10px' }}>
            <Card id='card' withBorder shadow='sm' radius="lg" style={{ height: '100%' }}>
                <Group position="apart" style={{ padding: '6px 4px' }} >
                    <div>Nodes</div>
                    <MultiSelect
                        data={nodes.map((node) => {
                            return node.data?.label;
                        })}
                        searchable
                        clearable
                        onChange={handleSelectedChange}
                        placeholder="search node..."
                        nothingFound="No nodes found"
                        id='searchbarNodes'
                        variant='filled'
                        size='xs'
                        radius='xl'
                        value={searchSelected.map(node => node.data?.label)}
                        
                    />

                </Group>
                <Divider />
                <ScrollArea h={scrollHeight} offsetScrollbars scrollbarSize={2}>
                    <NodeTree />
                </ScrollArea>
            </Card>
        </div>
    );
}
