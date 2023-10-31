import React, { useState, useEffect, useMemo } from 'react';

import { useAutocomplete, useGene2Drugs, useGene2Genes, useSingleGene } from './store/store';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import GeneNode from './GeneNode';
import DrugNode from './DrugNode';
import DiseaseNode from './DiseaseNode';
import { Card, Flex, Group, Text, Checkbox } from '@mantine/core';

// Filter component
export function FilterNodeTypesArea() {
  return (

    
    <div style={{ height: '100%', minWidth: '25%'}} className='FilterNodeTypeArea'>
      <Card withBorder shadow="sm" radius="lg" style={{width: '100%', height: '100%'}}>
        <Card.Section withBorder inheritPadding py="xs">
          <Group position="center">
            <Text weight={700} size="xl" mt="md" style={{textAlign: 'center'}}>Filter</Text>
          </Group>
          
          <Checkbox label="Show Genes" color="violet"/>
          <Checkbox label="Show Diseases" color="green"/>
          <Checkbox label="Show Drugs" color="red" className="filterCheck"/>
          
        </Card.Section>
      </Card>
    </div>
  );
}