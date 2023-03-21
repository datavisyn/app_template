import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { MantineProvider } from '@mantine/core';
import { VisynAppProvider } from 'visyn_core/app';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <VisynAppProvider appName="app_template">
        <App />
      </VisynAppProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
