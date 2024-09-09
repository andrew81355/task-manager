describe('it can create a task', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should create a new task', () => {
        cy.contains('Create a Task');
        cy.get('button.nav-btn').click();

        cy.get('dialog.dialog-box').should('be.visible'); // Check if the modal dialog is visible

        // Testing task creation form
        cy.get('h2').contains('Create a task');

        cy.get('input[name="desciption"]').type('New Task Title');

        // Select an option from the "status" dropdown
        cy.get('select[name="status"]').select('in progress');

        // Fill out the "description" textarea
        cy.get('textarea[name="description"]').type('This is a detailed description of the task.');

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Close Dialog
        cy.get('dialog.dialog-box').should('not.be.visible');
    });

    it('should create a new task using intercept', () => {
        cy.intercept('POST', '/api/tasks', {
            statusCode: 201,  // Simulate a 201 (Created) response
            body: {
                "message": "ok"
            },
        }).as('createTask');

        cy.contains('Create a Task');
        cy.get('button.nav-btn').click();

        cy.get('dialog.dialog-box').should('be.visible'); // Check if the modal dialog is visible

        // Testing task creation form
        cy.get('h2').contains('Create a task');

        cy.get('input[name="desciption"]').type('New Task Title');

        // Select an option from the "status" dropdown
        cy.get('select[name="status"]').select('in progress');

        // Fill out the "description" textarea
        cy.get('textarea[name="description"]').type('This is a detailed description of the task.');

        // Submit the form
        cy.get('button[type="submit"]').click();

        cy.wait('@createTask').its('request.body').should('deep.equal', {
            "description": "This is a detailed description of the task.",
            "status": "in progress",
            "title": "New Task Title"
        })

        // Close Dialog
        cy.get('dialog.dialog-box').should('not.be.visible');
    });

    it('can delete a task', () => {
        cy.get('button.nav-btn').click();
        cy.get('input[name="desciption"]').type('Test task');

        // Select an option from the "status" dropdown
        cy.get('select[name="status"]').select('in progress');

        // Fill out the "description" textarea
        cy.get('textarea[name="description"]').type('This is a detailed description of the task.');

        // Submit the form
        cy.get('button[type="submit"]').click();

        cy.contains('Test task').parent().parent().find('.delete-button').click();

        cy.contains('Test task').should('not.exist');
    })
});