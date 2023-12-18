
import { Autocomplete, Loader, MultiSelect } from '@mantine/core';
import React, { useState } from 'react';
import { useAutocomplete } from './store/store';
import { GeneGraph } from './GeneGraph';

export function App() {
  const [selectedValues, setSelectedValues] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: autocompleteData, isFetching } = useAutocomplete({ search });
  const symbolToIdMap = new Map(autocompleteData?.map(item => [(item[0]+' ('+item[2]+')'), item[1]])); // makes a id-List for backend
  const symbolsList = autocompleteData?.map(item => (item[0]+' ('+item[2]+')')); // Maked a SymbolList for FrontEnd
  
  // handels the change of selected values (these in the box)
  const handleSelectedChange = (values) => {
    console.log(values);
    const ids = values.map(value => symbolToIdMap.get(value));
    setSelectedValues(values); // Contains also already selected values
    setSelectedIds(ids); // update ids
  };

  // handels the change of the search field (so value will Be E, EG, EGS, ...)
  const handleChange = (values) => {
    setSearch(values);
  };
  const setIds = (ids: string[]) =>{
    setSelectedIds([...selectedIds, ids])
  }

  return (
    <>
      <MultiSelect
        data={symbolsList || []}
        searchable
        value={selectedValues}
        onSearchChange={handleChange}
        onChange={handleSelectedChange}
        placeholder="ENSG..."
        nothingFound="Keine Ergebnisse"
        rightSection={isFetching ? <Loader size="sm" /> : null}
      />

      <GeneGraph geneID={selectedIds} addID={setIds}/>
    </>
  );
}
/* just for testing: */
// import { Autocomplete, Loader, Button } from '@mantine/core';
// import React, { useState, useEffect, useCallback } from 'react';
// import { useAutocomplete, useGene2Genes } from './store/store';
// import { DrugGraph } from './DrugGraph';
// import { GeneGraph } from './GeneGraph';

// export function App() {
//   const [search, setSearch] = useState('');
//   const { data: autocompleteData, isFetching } = useAutocomplete({ search });

//   const { data: graph } = useGene2Genes({
//     gene: search || undefined,
//     limit: 1000,
//   });

//   const [geneInfo, setGeneInfo] = useState({});
//   const [showGeneInfo, setShowGeneInfo] = useState(false);

//   /* retrieve information for gene */
//   const fetchGeneInfo = useCallback(() => {
//     if (search) {
//       fetch(`http://localhost:9000/api/app/geneinfo/${search}`)
//         .then((response) => response.json())
//         .then((data) => {
//           setGeneInfo(data);
//         })
//         .catch((error) => {
//           console.error(error);
//           setGeneInfo({ 'Gene Name': 'Gene not found' });
//         });
//     }
//   }, [search]);

//   useEffect(() => {
//     fetchGeneInfo();
//   }, [fetchGeneInfo]);

//   const handleShowGeneInfo = () => {
//     setShowGeneInfo(true);
//   };

//   return (
//     <>
//       <Autocomplete
//         label="Search for genes"
//         placeholder="ENSG..."
//         value={search}
//         onChange={setSearch}
//         data={autocompleteData || []}
//         rightSection={isFetching ? <Loader size="sm" /> : null}
//       />

//       <Button onClick={handleShowGeneInfo}>Show gene info</Button>

//       {showGeneInfo && (
//         <>
//           <GeneGraph geneID={search} />

//           {/* Display the gene info */}
//           <div>
//             {geneInfo && (
//               <div>
//                 <strong>Gene Name:</strong> {geneInfo['Gene Name']}
//                 <br />
//                 <strong>Transcript Product:</strong> {geneInfo['Transcript Product']}
//                 <br />
//                 <strong>Chromosome Location:</strong> {geneInfo['Chromosome Location']}
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </>
//   );
// }
