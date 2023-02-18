import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { MantineProvider } from '@mantine/core';
import { VisynApp, VisynAppProvider } from 'visyn_core/app';

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <VisynAppProvider appName="app_template">
        <VisynApp loginMenu={null}>Hello app_template!</VisynApp>
      </VisynAppProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
