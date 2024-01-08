import shownIcon from './images/eye.png'
import hiddenIcon from './images/eye-closed.png'
import { ForkLeftRounded } from '@mui/icons-material'

export const onNodesVisibilityChange = (reactflow, nodes, visible)=> {

    const updatedNodes = reactflow.getNodes().map((node) => {

        if (nodes.some(n => n.id === node.id)) {
            return { ...node, hidden: visible }
        }

        return node
    })

    const updatedEdges = reactflow.getEdges().map((edge) => {
        
        if (visible === true) {
            if ((nodes.some(n => n.id == edge.source) || nodes.some(n => n.id === edge.target))) {
                return {...edge, hidden: visible}
            }
        } else {
            var leftNode = nodes.some(n => n.id == edge.source);
            var rightNode = nodes.some(n => n.id === edge.target);

            if (leftNode && rightNode) {
                return {...edge, hidden: false}
            } else if (leftNode && !rightNode) {
                var allNodes = reactflow.getNodes()
                var rightNode = allNodes.find(n => n.id === edge.target)
                if (rightNode.hidden) {
                    return {...edge, hidden: true}
                } else {
                    return {...edge, hidden: false}
                }
            } else if (!leftNode && rightNode) {
                var allNodes = reactflow.getNodes()
                var leftNode = allNodes.find(n => n.id === edge.source)
                if (leftNode.hidden) {
                    return {...edge, hidden: true}
                } else {
                    return {...edge, hidden: false}
                }
            } else {
                return {...edge, hidden: false}
            }
        }

        return edge
    })

    reactflow.setNodes(updatedNodes)
    reactflow.setEdges(updatedEdges)
}