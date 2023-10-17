import { Autocomplete, Loader, Button } from '@mantine/core';
import React, { useState, useEffect, useCallback } from 'react';
import { useAutocomplete, useGene2Genes } from './store/store';
import { DrugGraph } from './DrugGraph';
import { GeneGraph } from './GeneGraph';

export function App() {
  const [search, setSearch] = useState('');
  const { data: autocompleteData, isFetching } = useAutocomplete({ search });

  const { data: graph } = useGene2Genes({
    gene: search || undefined,
    limit: 1000,
  });

  const [geneName, setGeneName] = useState('');
  const [showGeneInfo, setShowGeneInfo] = useState(false);

  const fetchGeneName = useCallback(() => {
    if (search) {
      fetch(`http://localhost:9000/api/app/geneinfo/${search}`)
        .then((response) => response.json())
        .then((data) => {
          setGeneName(data);
        })
        .catch((error) => {
          console.error(error);
          setGeneName('Gene not found');
        });
    }
  }, [search]);

  useEffect(() => {
    fetchGeneName();
  }, [fetchGeneName]);

  const handleShowGeneInfo = () => {
    setShowGeneInfo(true);
  };

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

      <Button onClick={handleShowGeneInfo}>Show gene info</Button>

      {showGeneInfo && (
        <>
          <GeneGraph geneID={search} />

          {/* Display the gene name */}
          <div>
            {geneName && (
              <div>
                <strong>Gene Name:</strong> {geneName}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
