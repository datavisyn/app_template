import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
    useStore,
    Background,
    MiniMap,
    Controls
} from 'reactflow';

import { nodeTypes } from "./NodeTypes";
import FloatingEdge from './EdgeType';
import FloatingConnectionLine from './FloatingConnectionLine';

import { useExpand } from './store/store';

import { collide } from './collide';

import 'reactflow/dist/style.css';
import { SidebarFilterList } from './SidebarFilterList';


// Props for the GeneGraph component
type GeneGraphProps = {
    geneID: string[]; // changed to array
};

export const NodesContext = React.createContext(null)

const edgeTypes = {
    floating: FloatingEdge,
};


const simulation = forceSimulation()
    .force('charge', forceManyBody().strength(-1000))
    .force('x', forceX().x(0).strength(0.05))
    .force('y', forceY().y(0).strength(0.05))
    .force('collide', collide())
    .alphaTarget(0.05)
    .stop();

const useLayoutedElements = ():any => {
    const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
    const initialised = useStore((store) =>
        [...store.nodeInternals.values()].every((node) => node.width && node.height)
    );

    return useMemo(() => {
        let nodes = getNodes().map((node) => ({ ...node, x: node.position.x, y: node.position.y }));
        let edges = getEdges().map((edge) => edge);
        let running = false;

        // If React Flow hasn't initialised our nodes with a width and height yet, or
        // if there are no nodes in the flow, then we can't run the simulation!
        if (!initialised || nodes.length === 0) return [false, {}];

        simulation.nodes(nodes).force(
            'link',
            forceLink(edges)
                .id((d: any) => d.id)
                .strength(0.05)
                .distance(100)
        );

        // The tick function is called every animation frame while the simulation is
        // running and progresses the simulation one step forward each time.
        const tick = () => {
            getNodes().forEach((node, i) => {
                const dragging = Boolean(document.querySelector(`[data-id="${node.id}"].dragging`));

                // Setting the fx/fy properties of a node tells the simulation to "fix"
                // the node at that position and ignore any forces that would normally
                // cause it to move.
                (nodes[i] as any).fx = dragging ? node.position.x : null;
                (nodes[i] as any).fy = dragging ? node.position.y : null;
            });

            simulation.tick();
            setNodes(nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })));

            window.requestAnimationFrame(() => {
                // Give React and React Flow a chance to update and render the new node
                // positions before we fit the viewport to the new layout.
                fitView();

                // If the simulation hasn't be stopped, schedule another tick.
                if (running) tick();
            });
        };


        const setRunning = (r) => {
            running = r;
            running && window.requestAnimationFrame(tick);
        }

        const isRunning = () => running;

        return [true, {isRunning, setRunning }];
    }, [initialised]);
};

const LayoutFlow = (props: GeneGraphProps) => {
    const [initialised, { toggle, isRunning, setRunning }] = useLayoutedElements();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const { data: graph } = useExpand({
        geneIds: props.geneID,
        limit: 1000,
    });

    useMemo(() => {

        setNodes(graph?.nodes.map((node, index) => {
            return {
                id: node.id,
                position: {
                    x: (node.position.x + 1) * (window.innerWidth / 2),
                    y: (node.position.y + 1) * (window.innerHeight / 2)
                },
                data: {
                    label: node.symbol == "nan" ? node.id : node.symbol,
                    fullname: node.name,
                    summary: node.summary,
                    synonyms: node.synonyms,
                    entrezId: node.entrezId,
                    isRoot: props.geneID.includes(node.id) ? true : false
                },
                type: node.type.toString()
            }
        }));

        setEdges(
            graph?.edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: 'floating',
            }))
        );
        console.log(graph)
        console.log(initialised)
        if(graph != null && initialised){
            setRunning(true);
        }

    }, [graph,initialised]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionLineComponent={FloatingConnectionLine}
        >
            <Background />
            <Controls />
            <MiniMap />
        </ReactFlow>
    );
};

export default function (props) {
    return (
        <>
            <div style={{ height: '90%', width: '100%', display: 'flex' }}>
                <ReactFlowProvider>
                    <div style={{ height: '100%', width: '100%' }}>
                        <LayoutFlow geneID={props.geneID} />
                    </div>
                </ReactFlowProvider>
            </div>
        </>

    );
}
