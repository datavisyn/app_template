import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { VisynApp, VisynAppProvider, VisynHeader } from 'visyn_core/app';
import { Provider } from 'react-redux';
import { App } from './App';
import { store } from './store/store';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <VisynAppProvider appName="Graph">
        <VisynApp header={<VisynHeader />} loginMenu={null}>
          <App />
        </VisynApp>
      </VisynAppProvider>
    </Provider>
import { VisynApp, VisynAppProvider } from 'visyn_core/app';