
describe('Home Page', () => {
    it('should navigate to the home page and display the correct content', () => {
        // This will resolve to http://localhost:5173/
        cy.visit('/');
        cy.contains('Create a Task');
        cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
});