import shownIcon from './images/eye.png'
import hiddenIcon from './images/eye-closed.png'

export const onNodesVisibilityChange = (reactflow, nodes, visible)=> {

    // get updated images for each nodes that should be hidden
    nodes.forEach(node => {
        
        const image = document.getElementById(node.id + "_icon").getAttribute('src') === shownIcon ? hiddenIcon : shownIcon

        document.getElementById(node.id + "_icon").setAttribute('src', image)
    });

    const updatedNodes = reactflow.getNodes().map((node) => {

        if (nodes.some(n => n.id === node.id)) {
            return { ...node, hidden: !node.hidden }
        }

        return node
    })

    const updatedEdges = reactflow.getEdges().map((edge) => {

        if (nodes.some(n => n.id == edge.source) || nodes.some(n => n.id === edge.target)) {
            return {...edge, hidden: !edge.hidden}
        }

        return edge
    })

    reactflow.setNodes(updatedNodes)
    reactflow.setEdges(updatedEdges)
}