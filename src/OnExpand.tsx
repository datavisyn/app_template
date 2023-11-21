import React, { useState, useEffect, useMemo, createContext, useContext, useReducer } from 'react';
import { useExpand } from "./store/store";

export const onExpand = (geneIds: string[]) => {

    const { data: graph }=  useExpand({
            geneIds: geneIds,
          limit: 1000,
        });
    return graph
        

    //     useMemo(() => {
    //         reactflow.setNodes(graph?.nodes.map((node,index)=>{
    //           return{
    //             id:node.id,
    //             position:{
    //               x:(node.position.x+1)*(window.innerWidth/2),
    //               y:(node.position.y+1)*(window.innerHeight/2)
    //             },
    //             data:{
    //               label:node.symbol == "nan" ? node.id : node.symbol,
    //               fullname:node.name,
    //               summary:node.summary,
    //               synonyms:node.synonyms,
    //               entrezId:node.entrezId,
    //               onExpand: exp,
    //               onCollapse: coll
    //             },
    //             type:node.type.toString()
    //           }
    //         }));        


    
    //         reactflow.setEdges(
    //     graph?.edges.map((edge) => ({
    //       id: edge.id,
    //       source: edge.source,
    //       target: edge.target,
    //       type: 'floating',
    //     }))
    //   );
  
    // }, [graph]);
}