import { number } from 'prop-types';

describe('Data Visualizer App', () => {
    it('loads the page', () => {
        cy.visit('/');

        cy.window()
            .its('store')
            .invoke('getState')
            .its('range')
            .its('maxRange')
            .should('deep.equal', [undefined, undefined]);
        cy.wait(1000);
    });
    it('Gets expected max range', () => {
        cy.window()
            .its('store')
            .invoke('getState')
            .its('range')
            .its('maxRange')
            .should('deep.equal', [
                '2016-01-01T06:00:00.000000000Z',
                '2017-01-01T05:45:00.000000000Z',
            ]);
    });

    it('Gets data to display on trend', () => {
        cy.window()
            .its('store')
            .invoke('getState')
            .its('trend')
            .its('data')
            .should('have.length.greaterThan', 499);
    });

    it('Has Statistics', () => {
        cy.window()
            .its('store')
            .invoke('getState')
            .its('stats.max')
            .should('be.at.least', 0);
        cy.window()
            .its('store')
            .invoke('getState')
            .its('stats.min')
            .should('be.at.least', 0);

        cy.window()
            .its('store')
            .invoke('getState')
            .its('stats.min')
            .should('be.at.least', 0);
    });
});
