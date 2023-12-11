import React, { useState, useEffect, useMemo, createContext, useContext, useCallback } from 'react';
import { useExpand } from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider, Panel } from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from "./NodeTypes";
import FloatingEdge from './EdgeType';
import FloatingConnectionLine from './FloatingConnectionLine';
import { SidebarFilterList } from './SidebarFilterList';

import ELK from 'elkjs/lib/elk.bundled.js';


export const NodesContext = React.createContext(null)

const edgeTypes = {
  floating: FloatingEdge,
};

// Props for the GeneGraph component
type GeneGraphProps = {
  geneID: string[]; // changed to array
  addID;
};


const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
  };

  const getLayoutedElements = useCallback((options) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph = {
      id: 'root',
      layoutOptions: layoutOptions,
      children: getNodes(),
      edges: getEdges(),
    };

    elk.layout(graph as any).then(({ children }) => {

      // By mutating the children in-place we saves ourselves from creating a
      // needless copy of the nodes array.
      children.forEach((node) => {
        (node as any).position = { x: node.x, y: node.y };
      });

      setNodes(children as any);
      window.requestAnimationFrame(() => {
        fitView();
      });

    });
  }, []);

  return { getLayoutedElements };
};


// GeneGraph component
function GeneGraphLayout(props: GeneGraphProps) {
  let geneIds = props.geneID;

  // state for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { getLayoutedElements } = useLayoutedElements();



  // get all genes that are connected to the first node
  let { data: graph } = useExpand({
    geneIds: geneIds,
    limit: 1000,
  });

  useMemo(() => {

    (document as any).startViewTransition(() => {


      setNodes(graph?.nodes.map((node, index) => {
        return {
          id: node.id,
          position: {
            x: (node.position.x + 1) * (window.innerWidth / 2),
            y: (node.position.y + 1) * (window.innerHeight / 2)
          },
          data: {
            label: node.symbol == "nan" ? node.id : node.symbol,
            displayProps: {
              fullname: node.name,
              synonyms: node.synonyms,
              entrezId: node.entrezId,
              label: node.symbol == "nan" ? node.id : node.symbol,
              summary: node.summary,
            },
            isRoot: props.geneID.includes(node.id) ? true : false,
            type: node.type,
            onExpand: exp,
            onCollapse: coll
          },
          type: "node"
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
      console.log(graph);
      if(graph != null){
        getLayoutedElements({ 'elk.algorithm': 'org.eclipse.elk.force' })
      }
    })

  }, [graph]);

  function exp(id: string) {
    if (!geneIds.includes(id)) {
      geneIds = ([...geneIds, id])
      props.addID(id)
    }
  }

  function coll(id: string) {
    if (geneIds.includes(id))
      geneIds = geneIds.filter((f) => f !== id)

  }

  return (

    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}

      minZoom={0.1}
      maxZoom={10}

      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      connectionLineComponent={FloatingConnectionLine}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
      <Panel position="top-right">
        <button
          onClick={() =>
            getLayoutedElements({ 'elk.algorithm': 'org.eclipse.elk.force', })
          }
        >
          Do Shit
        </button>
      </Panel>
    </ReactFlow >

  );
}

export const LayoutGraph = (props) => {
  return (
    <>
      <div style={{ height: '90%', width: '100%', display: 'flex' }}>

        <ReactFlowProvider>
          <div style={{ height: '100%', width: '77%' }}>
            <GeneGraphLayout geneID={props.geneID} addID={props.addID} />
          </div>
          {/* <NodesContext.Provider value={{nodes: nodes, setNodes: setNodes}}>
            <SidebarFilterList />
          </NodesContext.Provider> */}

        </ReactFlowProvider>

      </div>

    </>

  );

}