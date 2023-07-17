describe('Signup', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/signup');
    });

    it('should allow users to enter email and password', () => {
        const email = 'test@example.com';
        const password = 'test123';

        cy.get('input[type="email"]').type(email).should('have.value', email);
        cy.get('input[type="password"]').type(password).should('have.value', password);
    });

    it('should navigate to the login page', () => {
        cy.contains('LOG IN').click();
        cy.url().should('include', '/');
    });

    it('should not allow users to signup with invalid email', () => {
        const email = '1';
        const password = 'test123';

        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button').contains('SIGN UP').click();
        cy.url().should('include', '/signup');
    });
});

