import React, { useState, useEffect, useRef, useMemo } from 'react';
import dagre from 'dagre';
import { useAutocomplete, useGene2Drugs, useGene2Genes, useSingleGene } from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import GeneNode from './GeneNode';
import DrugNode from './DrugNode';
import DiseaseNode from './DiseaseNode';



const nodeWidth = 172;
const nodeHeight = 36;

const nodeTypes = { diseaseNode: DiseaseNode, geneNode: GeneNode, drugNode: DrugNode };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges) => {

    dagreGraph.setGraph({ rankdir: 'TB', align: 'UL' })

    nodes?.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges?.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre?.layout(dagreGraph);

    nodes?.forEach((node) => {

        const nodeWithPosition = dagreGraph.node(node.id);

        node.targetPosition = 'top';
        node.sourcePosition = 'bottom';

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
    });

    return { nodes, edges };
};

type GeneGraphProps = {
    geneID: string
}

export function GeneGraph(props: GeneGraphProps) {
    
    const[nodes ,setNodes,onNodesChange] = useNodesState([]);
    const[edges ,setEdges,onEdgesChange] = useEdgesState([]);

    
        //continue if gene with that id exists
        const { data: firstNode } = useSingleGene({ gene: props.geneID });

        const { data: graph } = useGene2Genes({
            gene: props.geneID || undefined,
            limit: 1000,
        });

        useEffect(()=>{

            const allNodes = graph?.concat(firstNode);
            

            // add nodes
            setNodes(allNodes?.map(node => {
            return {
                id: node.ENSG_B,
                position: {
                    x: Math.random() * 2000,
                    y: Math.random() * 700,
                },
                data: {
                    label:
                        node.ENSG_A === firstNode?.at(0).ENSG_A ? node.ENSG_B_name : node.ENSG_A_name
                }
            }}))
    
            setEdges(allNodes?.map(edge => ({
                id: edge.ENSG_A + "-" + edge.ENSG_B,
                source: edge.ENSG_A,
                target: edge.ENSG_B
            })))
        },[graph]);



        

        // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        //     nodes,
        //     edges
        // );

        // const [nodesForFlow, setNodes, onNodesChange] = useNodesState(layoutedNodes);
        // const [edgesForFlow, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

        // useEffect(() => {
        //     setNodes(layoutedNodes);
        //     setEdges(layoutedEdges);
        // }, [props.geneID]);


        return (
            <div style={{ height: '90%' }}>
                <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}  onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}>
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </div>
        );
    

}

function useCallback(arg0: (nodes: any) => void, arg1: undefined[]) {
    throw new Error('Function not implemented.');
}

// function useMemo(arg0: () => void) {
//   throw new Error('Function not implemented.');
// }

