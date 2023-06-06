import * as React from 'react';
import { useAutocomplete,useGene2Drugs, useGraph } from './store/store';


type DrugGraphProps={
    geneID:string
}

type diseaseType = {
    gene: string
    padj: number
    disease: string
}

export function DrugGraph(props:DrugGraphProps) {

    const { data: graph } = useGene2Drugs({
        gene: props.geneID || undefined,
        limit: 1000,
      });

  return (
    <>
    {graph?.map((d:diseaseType) => (
        <div key={`${d.disease}-${d.padj}`}>
          {d.gene} - {d.disease}
        </div>
      ))}
    </>
  );
}
