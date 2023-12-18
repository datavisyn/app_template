import React, { useEffect } from 'react';
import { Viewer } from 'molstar/build/viewer/molstar';

interface MolStarViewerProps {
  pdbFilePath: string;
}

const MolOptions: React.FC<MolStarViewerProps> = ({ pdbFilePath }) => {
  useEffect(() => {
    console.log("MolStarViewer is mounted with PDB file:", pdbFilePath);
    const viewerOptions = {
      layoutIsExpanded: false,
      layoutShowControls: false,
      layoutShowRemoteState: false,
      layoutShowSequence: true,
      layoutShowLog: false,
      layoutShowLeftPanel: true,

      viewportShowExpand: true,
      viewportShowSelectionMode: false,
      viewportShowAnimation: false,

      pdbProvider: 'rcsb',
      emdbProvider: 'rcsb',
    };
    
    const initViewer = async () => {
      const viewer = new Viewer('molstar-container', viewerOptions);
      await viewer.loadPdb(pdbFilePath);
      console.log("Viewer state is:", viewer.plugin.state);

      return () => {
        viewer.dispose();
      };
    };

    initViewer();
  }, [pdbFilePath]);

  return <div id="molstar-container" style={{ width: '100%', height: '500px' }} />;
};

export default MolOptions;
