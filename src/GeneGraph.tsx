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
  setIds;
};


const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    'elk.algorithm': 'org.eclipse.elk.force',
    'elk.layered.spacing.nodeNodeBetweenLayers': 100,
    'elk.spacing.nodeNode': 80,
  };

  const getLayoutedElements = useCallback(() => {
    const layoutOptions = { ...defaultOptions };
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
        fitView({
          maxZoom: 15,
          minZoom: 0.1,
          duration: 5000,
          nodes: getNodes()
        });
      });
    });
  }, []);

  return { getLayoutedElements };
};


// GeneGraph component
export function GeneGraph(props: GeneGraphProps) {
  let geneIds = props.geneID;

  // state for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  let fixedIds = []
  if(nodes != undefined &&  nodes.length != 0){
    // let fixedNodes = nodes.filter(node => node.data.children.length == 0 && node.data.parents.length == 0)
    // fixedIds = fixedNodes.map(({ id }) => id);
  }  const { getLayoutedElements } = useLayoutedElements();
  const [curNodes, setCurNodes] = useState(0);



  // get all genes that are connected to the first node
  let { data: graph } = useExpand({
      geneIds: geneIds,
      fixedGeneIds: fixedIds,
    limit: 1000,
  });

  const { getNodes, fitView, getEdges } = useReactFlow();

  useMemo(() => {
    if (getNodes().length !==0 && getEdges().length !==0 && getNodes()?.length != curNodes && getNodes()[0]["width"] != null) {
        setCurNodes(getNodes().length);
        getLayoutedElements();
    }


    window.requestAnimationFrame(() => {
      fitView({
        maxZoom: 20,
        minZoom: 0.1,
        duration: 5000,
        nodes: getNodes()
      });
    });


  }, [getNodes().map(node => {node.id})]);

  useMemo(() => {
    setCurNodes(0);
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
            children: node.children,
            parents: node.parents,
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

    })

  }, [graph]);

  function exp(id: string) {
    if (!geneIds.includes(id)) {
      geneIds = ([...geneIds, id])
      props.setIds(geneIds)
    }
  }

  function coll(id: string, children: [string]) {
    geneIds = geneIds.filter(geneId => geneId != id)
    let currentNodes = getNodes();
    currentNodes.forEach((child) => {
      child.data.parents = child.data.parents.filter((parent: string) => parent != id)
      if(child.id == id){
        child.data.children = []
        child.data.isRoot = false
      }
    })
      
    var removeChildren = currentNodes.filter(node => children.includes(node.id))
    removeChildren = removeChildren.filter(node => node.data?.parents.length == 0)
    currentNodes = currentNodes.filter(node => !removeChildren.includes(node))
    setNodes(currentNodes)
  }

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex' }}>
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
      </ReactFlow >
      <NodesContext.Provider value={{ nodes: nodes, setNodes: setNodes }}>
        <SidebarFilterList />
      </NodesContext.Provider>
    </div>
  );
}