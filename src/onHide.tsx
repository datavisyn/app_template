import shownIcon from './images/eye.png'
import hiddenIcon from './images/eye-closed.png'

export const onHide = (reactflow, nodeId) => {

    // evaluate updated image after button click
    const updatedImage = document.getElementById(nodeId + "_icon").getAttribute('src') === shownIcon ? hiddenIcon : shownIcon
    
    reactflow.setNodes(reactflow.getNodes().map((node) => {
        if (node.id === nodeId) {
            return { ...node, hidden: !node.hidden }
        }

        return node
    }))

    reactflow.setEdges(reactflow.getEdges().map((edge) => {
        if (edge.source === nodeId || edge.target === nodeId) {
            return { ...edge, hidden: !edge.hidden }
        }

        return edge
    })) 

    // set evaluated image after button click
    document.getElementById(nodeId + "_icon").setAttribute('src', updatedImage)
}