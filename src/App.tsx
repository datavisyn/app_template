import { Autocomplete, Loader } from '@mantine/core';
import React, { useState } from 'react';
import { useAutocomplete } from './store/store';
import { GeneGraph } from './GeneGraph';

export function App() {
  const [search, setSearch] = useState('');
  const { data: autocompleteData, isFetching } = useAutocomplete({ search });


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
