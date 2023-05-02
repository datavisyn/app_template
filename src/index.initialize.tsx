import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { VisynApp, VisynAppProvider } from 'visyn_core/app';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <VisynAppProvider appName="App Template">
        <VisynApp loginMenu={null}>Hello app_template!</VisynApp>
      </VisynAppProvider>
    </MantineProvider>
  </React.StrictMode>,
);
