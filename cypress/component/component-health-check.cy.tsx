import * as React from 'react';
import { VisynApp, VisynAppProvider } from 'visyn_core/app';

describe('Health check for Cypress component test', () => {
  it('should mount App', () => {
    cy.mount(
      <VisynAppProvider appName="app_template">
        <VisynApp loginMenu={null}>Hello app_template!</VisynApp>
      </VisynAppProvider>,
    );
    cy.get('div').should('include.text', 'Hello app_template!');
  });
});
