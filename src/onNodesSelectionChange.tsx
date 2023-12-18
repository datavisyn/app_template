export const onNodesSelectionChange = (reactflow, nodes) => {
    if (nodes && nodes.length > 0) {
        reactflow.setNodes(reactflow.getNodes().map((n) => {
            const isSelected = nodes.some(selectedNode => selectedNode.id === n.id);
            return {
                ...n,
                selected: isSelected
            };
        }));
    }
    else {
        reactflow.setNodes(reactflow.getNodes().map((n) => {
            return { ...n, selected: true }
        }))
    }
}