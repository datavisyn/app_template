import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { VisynAppProvider } from 'visyn_core/app';
import { store } from './store/store';
import { App } from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <VisynAppProvider disableMantine6 appName="App Template">
        <App />
      </VisynAppProvider>
    </Provider>
  </React.StrictMode>,
);
