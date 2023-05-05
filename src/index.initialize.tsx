import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { VisynApp, VisynAppProvider } from 'visyn_core/app';

ReactDOM.render(
  <React.StrictMode>
    <VisynAppProvider appName="App Template">
      <VisynApp loginMenu={null}>Hello app_template!</VisynApp>
    </VisynAppProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
