import { Autocomplete, Loader } from '@mantine/core';
import React, { useState } from 'react';
import { useAutocomplete, useGene2Genes } from './store/store';
import { DrugGraph } from './DrugGraph';
import { GeneGraph } from './GeneGraph';
import { FilterNodeTypesArea } from './FilterNodeTypesArea';

export function App() {
  const [search, setSearch] = useState('');
  const { data: autocompleteData, isFetching } = useAutocomplete({ search });

  const { data: graph } = useGene2Genes({
    gene: search || undefined,
    limit: 1000,
  });

  return (
    <>
      <Autocomplete
        label="Search for genes"
        placeholder="ENSG..."
        value={search}
        onChange={setSearch}
        data={autocompleteData || []}
        rightSection={isFetching ? <Loader size="sm" /> : null}
      />

      <GeneGraph geneID={search} />
    </>
  );
}
