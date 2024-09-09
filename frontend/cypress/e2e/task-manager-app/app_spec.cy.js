// describe('My Vue.js Application', () => {
//     it('should load the homepage', () => {
//         cy.visit('/');  // Assuming your app runs locally at the root URL
//         // cy.contains('Welcome to Your Vue.js App');  // Verify that the homepage renders
//     });
//
//     // it('should navigate to another page', () => {
//     //     cy.visit('/');
//     //     cy.get('a[href="/about"]').click();  // Click on the About link (example)
//     //     cy.url().should('include', '/about');  // Verify URL has changed
//     //     cy.contains('About Us');  // Verify the content on the about page
//     // });
// });

describe('Home Page', () => {
    it('should navigate to the home page and display the correct content', () => {
        cy.visit('/');  // This will resolve to http://localhost:5173/
        cy.contains('Create a Task');
        cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
});