import shownIcon from './images/eye.png'
import hiddenIcon from './images/eye-closed.png'

export const onNodesVisibilityChange = (reactflow, nodes, visible)=> {

    const updatedNodes = reactflow.getNodes().map((node) => {

        if (nodes.some(n => n.id === node.id)) {
            return { ...node, hidden: visible }
        }

        return node
    })

    const updatedEdges = reactflow.getEdges().map((edge) => {

        if ((nodes.some(n => n.id == edge.source) || nodes.some(n => n.id === edge.target))) {
            return {...edge, hidden: visible}
        }

        return edge
    })

    // get updated images for each nodes that should be hidden
    updatedNodes.forEach(node => {
        
        const image = node.hidden ? hiddenIcon : shownIcon

        document.getElementById(node.id + "_icon").setAttribute('src', image)
    });

    reactflow.setNodes(updatedNodes)
    reactflow.setEdges(updatedEdges)
}