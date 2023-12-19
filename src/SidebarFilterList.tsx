import React, { useEffect, useState, useMemo } from 'react'
import { useReactFlow } from "reactflow";
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
    // full height list:
    


    // get state of nodes from parent component
    const reactflow = useReactFlow()
    const nodes = reactflow.getNodes()

    const NodeTree = () => {
        const [nodes, setNodes] = useState([]);
        var globalBool = false;

        // toogle tree Node Categorie -> call hide for all nodes in list
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

        // Übergeben Sie das gesamte Node-Objekt, nicht nur das Label
        const geneNodes = nodes.filter(node => node.data.type === 'gene');
        const diseaseNodes = nodes.filter(node => node.data.type === 'disease');
        const drugNodes = nodes.filter(node => node.data.type === 'drug');

        const nodeLists = [geneNodes, diseaseNodes, drugNodes];
        const types = ["genes", "diseases", "drugs"];

        const [expanded, setExpanded] = React.useState(() => {
            // Versuche, den gespeicherten Zustand aus localStorage zu laden
            const saved = localStorage.getItem('expandedState');
            return saved ? JSON.parse(saved) : []; // Standardwert ist ein leerer Array, falls nichts in localStorage gespeichert ist
        });
        
        // useEffect-Hook, um den expanded-Zustand in localStorage zu speichern, wenn er sich ändert
        React.useEffect(() => {
            localStorage.setItem('expandedState', JSON.stringify(expanded));
        }, [expanded]);

        const handleExpand = (type) => {
            if (expanded.includes(type)) {
                setExpanded(expanded.filter((item) => item !== type));
                console.log("after remove ", expanded);
            } else {
                setExpanded([...expanded, type]);
                console.log("after add ", expanded);
            }
        }

        useEffect(() => {
            setNodes(reactflow.getNodes());
        }, [reactflow]);

        return (
            <ThemeProvider theme={theme}>
                <TreeView expanded={expanded}>
                    {nodeLists.map((list, index) => {
                        if (list.length > 0) return (
                            <TreeItem
                                key={'listNode_' + index + "_" + types[index]} // Unique Key -> Prevent Error
                                nodeId={'listNode_' + index + "_" + types[index]}
                                label={types[index]}
                                onDoubleClick={() => toggleNodeCategory(types[index])}
                                onClick={() => handleExpand('listNode_' + index + "_" + types[index])}
                                expandIcon={<ChevronRightIcon />}
                                collapseIcon={<ExpandMoreIcon />}
                            >
                                {list.map((node) => (
                                    <TreeItem
                                        key={node.id} // Unique Key -> Prevent Error
                                        nodeId={node.data.displayProps.label + "_" + index + "_treeItem"}
                                        label={node.data.displayProps.label}
                                        endIcon={node.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        onClick={() => toggleNodeVisibility(node.id)}

                                    />
                                ))}
                            </TreeItem>
                        )
                    })}
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