
describe('Home Page', () => {
    it('should navigate to the home page and display the correct content', () => {
        cy.visit('/');  // This will resolve to http://localhost:5173/
        cy.contains('Create a Task');
        cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
});