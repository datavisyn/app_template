
import { Autocomplete, Loader, MultiSelect } from '@mantine/core';
import React, { useState } from 'react';
import { useAutocomplete } from './store/store';
import { GeneGraph } from './GeneGraph';
import { FilterNodeTypesArea } from './FilterNodeTypesArea';

export function App() {
  const [selectedValues, setSelectedValues] = useState([]);
  const [search, setSearch] = useState("");
  const { data: autocompleteData, isFetching } = useAutocomplete({ search });
  const handleChange = (values) => {
    setSearch(values[-1]); // Setze den Suchbegriff auf den ersten ausgewählten Wert
    setSelectedValues(values); // Aktualisiere den Zustand mit den neuen Werten
    console.log(values); // Logge die ausgewählten Werte in der Konsole
  };

  return (
    <>
      <MultiSelect
        data={autocompleteData || []}
        searchable
        value={selectedValues}
        onSearchChange={handleChange}
        onChange={handleChange}
        placeholder="ENSG..."
        nothingFound="Keine Ergebnisse"
        rightSection={isFetching ? <Loader size="sm" /> : null}
        label="searcg Label"
      />

      <GeneGraph geneID={selectedValues} />
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
