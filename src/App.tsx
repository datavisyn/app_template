import { Autocomplete, Loader } from '@mantine/core';
import * as React from 'react';
import { useAutocomplete, useGene2Genes } from './store/store';
import { DrugGraph } from './DrugGraph';
import { GeneGraph } from './GeneGraph';

export function App() {
  const [search, setSearch] = React.useState('');
  const { data: autocompleteData, isFetching } = useAutocomplete({
    search,
  });

  // Variant A: manual data fetching using useEffect and fetch. Has many problems like race conditions, no caching, ...
  /*
  const [data, setData] = React.useState<{ ENSG_A: string; ENSG_B: string }[]>([]);
  React.useEffect(() => {
    // Very basic check for race condition. If the search changes, set the current useEffect to not be the current one.
    let current = true;
    (async () => {
      const url = new URLSearchParams();
      if (search) {
        url.append('gene', search || '');
      }
      url.append('limit', '10');
      const response = await fetch(`/api/app/graph?${url.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const graph = await response.json();

      if (current) {
        setData(graph);
      }
    })();

    return () => {
      current = false;
    };
  }, [search]);
  */

  // Variant B (preferred): data fetching using rtk-query: https://redux-toolkit.js.org/rtk-query/usage/code-generation#openapi
  // This is more complicated to setup, but makes using the API much easier. It essentially generates hooks for you via `yarn run codegen:openapi`.
  // This will generate a new `store/generatedAppApi.ts` file with the hooks and types.
  // Then, in the `store/store.ts`, you can reexport the hooks as they usually get long names like `useGet...`.
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
      {/* {graph?.map((d) => (
        <div key={`${d.ENSG_A}-${d.ENSG_B}`}>
          {d.ENSG_A} - {d.ENSG_B}
        </div>
      ))} */}
      {/* <DrugGraph geneID='ENSG00000030110'/> */}

      <GeneGraph genes={graph} />
    </>
  );
}
