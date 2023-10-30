import React, {useContext} from 'react'
import { GraphNodesContext } from './GeneGraph'

export function HideGeneNodesBtn() {

    // access state from gene graph component
    const {nodes, setNodes} = useContext(GraphNodesContext);

    const hideNodes = () => {
        nodes[0].data.label = "blaba"
        setNodes(nodes);
        console.log(nodes)
    }

    return (
        <button onClick={hideNodes}>
            <p>Press</p>
        </button>
    )
}