import React, { useEffect, useState, useMemo } from 'react'
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { filter } from 'd3';



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
    const [selectionNodes, setSelectionNodes] = useState(nodes.filter(node => node.selected));

    useOnSelectionChange({
        onChange: ({ nodes, edges }) => {
            setNodesSelected(nodes.filter(node => node.selected))
            setSelectionNodes(nodes.filter(node => node.selected))
        },

    });


    const NodeTree = () => {
        const [nodes, setNodes] = useState([]);

        useEffect(() => {
            setNodes(reactflow.getNodes());
        }, [reactflow])

        var globalBool = false;

        // toogle tree Node Category -> call hide for all nodes in list
        const toggleNodeCategory = (type) => {
            var newType = type.slice(0, -1);

            const updatedNodes = nodes.map(node => {
                if (node.data.type === newType) {
                    globalBool = !node.hidden;
                    return { ...node, hidden: !node.hidden };
                }
                return node;
            });

            setNodes(updatedNodes);
            onNodesVisibilityChange(reactflow, updatedNodes.filter(node => node.data.type === newType), globalBool);
        };

        // toogle Hidden Nodes
        const toggleNodeVisibility = (nodeId) => {
            let currentHidden;
            let updatedNode;

            const updatedNodes = nodes.map(node => {
                if (node.id === nodeId) {
                    currentHidden = !node.hidden;
                    updatedNode = { ...node, hidden: currentHidden };
                    return updatedNode;
                }
                return node;
            });

            setNodes(updatedNodes);
            onNodesVisibilityChange(reactflow, [updatedNode], currentHidden);
        };

        const geneNodeLabels = nodes.filter(node => node.data.type === 'gene');
        const diseaseNodeLabels = nodes.filter(node => node.data.type === 'disease');
        const drugNodeLabels = nodes.filter(node => node.data.type === 'drug');

        const nodeLists = [geneNodeLabels, diseaseNodeLabels, drugNodeLabels]
        const types = ["genes", "diseases", "drugs"]

        const [treeViewSelection, setTreeViewSelection] = useState(nodesSelected.map(node => node.data?.label + "_treeItem"));
        const [treeViewExpanded, setTreeViewExpanded] = useState(() => {
            // load from local stroage after rerender
            return JSON.parse(localStorage.getItem('expandedNodes') || '[]');
        });

        useEffect(() => {
            setTreeViewSelection(nodesSelected.map(node => node.data?.label))
        }, [nodesSelected])

        const handleNodeToggle = (event, nodes) => {
            setTreeViewExpanded(nodes);
            localStorage.setItem('expandedNodes', JSON.stringify(nodes));
        };

        const handleNodeSelect = (event, value) => {
            // setTreeViewExpanded(value)

            var selected = nodes.filter(node => value.includes(node.data?.label))
            if (selected.length > 0) {
                onNodesSelectionChange(reactflow, selected)
            }
        }

        return (
            <ThemeProvider theme={theme}>
                <TreeView
                    multiSelect={true}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    selected={treeViewSelection}
                    onNodeSelect={handleNodeSelect}
                    onNodeToggle={handleNodeToggle}
                    expanded={treeViewExpanded}
                >
                    {
                        nodeLists.map((list, index) => {
                            if (list.length > 0) return (
                                <TreeItem
                                    key={'listNode_' + index + "_" + types[index]} // Unique Key -> Prevent Error
                                    onDoubleClick={() => toggleNodeCategory(types[index])}
                                    expandIcon={<ChevronRightIcon />}
                                    collapseIcon={<ExpandMoreIcon />}
                                    nodeId={types[index]}
                                    label={types[index]}>
                                    {list.map((node) => {
                                        return <TreeItem
                                            key={node.id} // Unique Key -> Prevent Error
                                            nodeId={node.data.displayProps.label}
                                            label={node.data.displayProps.label}
                                            endIcon={node.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            onClick={() => toggleNodeVisibility(node.id)}

                                        />
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
                    <ScrollArea offsetScrollbars scrollbarSize={2}>
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
                            value={selectionNodes.map(node => node.data?.label)}
                        />
                    </ScrollArea>

                </Group>
                <Divider />
                <ScrollArea h={scrollHeight} offsetScrollbars scrollbarSize={2}>
                    <NodeTree />
                </ScrollArea>
            </Card>
        </div>
    );
}
