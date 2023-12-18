import React, { useEffect, useRef, useCallback } from 'react';
import { Viewer, ViewerOptions } from 'molstar/build/viewer/molstar';

interface MolViewerProps {
  options?: Partial<ViewerOptions>;
  entrez_id?: string;
}

function MolViewer({ options, entrez_id }: MolViewerProps) {
  const viewerRef = useRef<Viewer | null>(null);
  const isMountedRef = useRef(false);

  const fetchUniProtId = useCallback(async (entrezId: string) => {
    try {
      const response = await fetch(`https://mygene.info/v3/gene/${entrezId}?fields=uniprot&dotfield=false&size=10`);
      const data = await response.json();
      return data?.uniprot?.['Swiss-Prot'] || null;
    } catch (error) {
      console.error('Error fetching UniProt ID:', error);
      return null;
    }
  }, []);

  const fetchAlphaFoldData = useCallback(async (uniProtId: string | null) => {
    try {
      const response = await fetch(`https://alphafold.ebi.ac.uk/api/prediction/${uniProtId}?key=key`);
      const data = await response.json();
      return data?.[0]?.cifUrl || null;
    } catch (error) {
      console.error('Error fetching AlphaFold data:', error);
      return null;
    }
  }, []);

  const loadStructure = useCallback(async (cifUrl: string | null) => {
    if (isMountedRef.current && cifUrl) {
      try {
        await viewerRef.current?.loadStructureFromUrl(cifUrl);
        console.log('Structure loaded successfully');
      } catch (error) {
        console.error('Error loading structure:', error);
      }
    }
  }, []);

  useEffect(() => { 
    isMountedRef.current = true;
  
    const initViewer = async () => {
      if (isMountedRef.current) {
        try {
          const molstarContainer = document.getElementById('mol-container');
  
          if (molstarContainer && entrez_id) {
            const uniProtId = await fetchUniProtId(entrez_id);
            const cifUrl = await fetchAlphaFoldData(uniProtId);
            
            if (uniProtId && cifUrl) {
              const viewerOptions: Partial<ViewerOptions> = {
                ...options,
                layoutShowControls: false, // Set layoutShowControls to false
              };
  
              const viewer = await Viewer.create('mol-container', viewerOptions);
              viewerRef.current = viewer;
  
              if (viewer) {
                console.log('Viewer created successfully');
                console.log('Plugin builders:', viewerRef.current.builders);
  
                if (viewerRef.current.plugin.builders.structure) {
                  await loadStructure(cifUrl);
                }
              } else {
                console.error('Error creating viewer');
              }
            }
          }
        } catch (error) {
          console.error('Error initializing viewer:', error);
        }
      }
    };
  
    initViewer();
  
    return () => {
      isMountedRef.current = false;
    };
  }, [options, entrez_id, fetchUniProtId, fetchAlphaFoldData, loadStructure]);

  return <div id="mol-container" style={{ width: '50px', height: '50px' }} />;
}

export default MolViewer;
