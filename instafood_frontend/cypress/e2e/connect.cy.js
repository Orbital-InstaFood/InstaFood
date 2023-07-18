describe('Connect', () => {
    before(() => {
        cy.visit('http://localhost:3000/');
        cy.fixture('loginCredentials').then((loginCredentials) => {
            const email = loginCredentials.email;
            const password = loginCredentials.password;

            cy.get('input[type="email"]').type(email);
            cy.get('input[type="password"]').type(password);
            cy.get('button').contains('LOG IN').click();
            cy.get('.logout-container').should('be.visible');
            cy.get('.navbar-link').contains('Connect').click();
            cy.url().should('include', '/connect');
            cy.get(['data-testid=loading-spinner']).should('not.be.visible');
        });
    });

    after(() => {
        cy.get('.logout-container').click();
    });

    it('should display the search bar', () => {
        cy.get('input[type="text"]')
        .should('be.visible')
        .type('test')
        .should('have.value', 'test');
    });

});