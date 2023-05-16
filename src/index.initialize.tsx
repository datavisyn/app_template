import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { VisynApp, VisynAppProvider } from 'visyn_core/app';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VisynAppProvider appName="App Template">
      <VisynApp loginMenu={null}>Hello app_template!</VisynApp>
    </VisynAppProvider>
  </React.StrictMode>,
);
