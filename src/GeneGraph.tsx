import React, { useState, useEffect, useMemo, createContext, useContext, useReducer } from 'react';

import {useExpand} from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Handle, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes } from "./NodeTypes";
import FloatingEdge from './EdgeType';
import FloatingConnectionLine from './FloatingConnectionLine';
import { FilterNodeTypesArea } from './FilterNodeTypesArea';

const maxNodesPerCircle = 20;
const edgeTypes = {
  floating: FloatingEdge,
};



// Props for the GeneGraph component
type GeneGraphProps = {
  geneID: string[]; // changed to array
};

// GeneGraph component
export function GeneGraph(props: GeneGraphProps) {
  let geneIds = props.geneID;

  // State for the nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [geneIDs, setGeneIDs] = useState<string[]>(props.geneID);
  const [graphState, setGraph] = useState<any>();



  // get all genes that are connected to the first node
  // let { data: graph } = useExpand({
  //     geneIds: geneIDs,
  //   limit: 1000,
  // });


  useEffect(()=>{
      let { data: graph } = useExpand({
      geneIds: geneIDs,
      limit: 1000,
      });

    setGraph(graph);  },[geneIDs]);

  useMemo(() => {
    setNodes(graphState?.nodes.map((node,index)=>{
      return{
        id:node.id,
        position:{
          x:(node.position.x+1)*(window.innerWidth/2),
          y:(node.position.y+1)*(window.innerHeight/2)
        },
        data:{
          label:node.symbol == "nan" ? node.id : node.symbol,
          fullname:node.name,
          summary:node.summary,
          synonyms:node.synonyms,
          entrezId:node.entrezId,
          onExpand: exp,
          onCollapse: coll
        },
        type:node.type.toString()
      }
    }));


    
    setEdges(
      graphState?.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'floating',
      }))
    );

  }, [graphState]);

  function exp(id: string){
    if(!geneIds.includes(id)){
      setGeneIDs([...geneIDs,id])
    }
  }

  function coll(id: string){
    if(geneIds.includes(id))
      geneIds = geneIds.filter((f)=>f!==id)
    console.log(id);
    console.log(geneIds);
  }

  return (
    <>
      <div style={{ height: '90%', width: '100%', display: 'flex' }}>

        <ReactFlowProvider>
          <div style={{ height: '100%', width: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              connectionLineComponent={FloatingConnectionLine}
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>
          {/* <div style={{ minHeight: '100%', width: '15%' }}>
            <FilterNodeTypesArea />
          </div> */}
        </ReactFlowProvider>

      </div>

    </>

  );
}