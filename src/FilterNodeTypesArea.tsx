import React, { useState, useEffect} from 'react';
import 'reactflow/dist/style.css';
import { Card, Group, Text, Checkbox } from '@mantine/core';
import { useReactFlow } from 'reactflow';
import { useForceUpdate } from '@mantine/hooks';


// Filter component
export function FilterNodeTypesArea() {

  // get state of nodes from parent component
  const reactflow = useReactFlow();

  // states for filter effects
  const [genesHidden, setGenesHidden] = useState(false);
  const [diseasesHidden, setDiseasesHidden] = useState(false);
  const [drugsHidden, setDrugsHidden] = useState(false);

  useEffect(() => {

    // get updated nodes
    const updatedNodes = reactflow.getNodes().map((node) => {
      return {...node,
              hidden:
                node.type === "gene" ? genesHidden :
                node.type === "disease" ? diseasesHidden :
                node.type === "drug" ? drugsHidden : false
            };
    });

    // set updated nodes
    reactflow.setNodes(updatedNodes)

    reactflow.setEdges(reactflow.getEdges().map((edge) => {

      const sourceNode = updatedNodes.find(node => node.id === edge.source);
      const targetNode = updatedNodes.find(node => node.id === edge.target);

      return {... edge, hidden: (sourceNode.hidden || targetNode.hidden)}
    }))

  }, [genesHidden, diseasesHidden, drugsHidden])

  return (
    <div style={{ height: '100%', minWidth: '25%' }} className='FilterNodeTypeArea'>
      <Card withBorder shadow="sm" radius="lg" style={{ width: '100%', height: '100%' }}>
        <Card.Section withBorder inheritPadding py="xs">
          <Group position="center">
            <Text weight={700} size="xl" mt="md" style={{ textAlign: 'center' }}>Filter</Text>
          </Group>

          <Checkbox label="Hide Genes" color="#4BB268" onChange={(evt) => setGenesHidden(evt.target.checked)} />
          <Checkbox label="Hide Diseases" color="#FF964D" onChange={(evt) => setDiseasesHidden(evt.target.checked)} />
          <Checkbox label="Hide Drugs" color="#B42865" className="filterCheck" onChange={(evt) => setDrugsHidden(evt.target.checked)} />

        </Card.Section>
      </Card>
    </div>
  );
}