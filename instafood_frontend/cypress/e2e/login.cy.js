describe('Login', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it('should display the login form', () => {
        cy.get('h2').should('contain', 'LOG IN');
        cy.get('label').should('contain', 'EMAIL');
        cy.get('label').should('contain', 'PASSWORD');
        cy.get('button').should('contain', 'LOG IN');
    });

    it('should allow users to enter email and password', () => {
        const email = 'test@example.com';
        const password = 'test123';

        cy.get('input[type="email"]').type(email).should('have.value', email);
        cy.get('input[type="password"]').type(password).should('have.value', password);
    });

    it('should navigate to the forgot password page', () => {
        cy.contains('Forgot password?').click();
        cy.url().should('include', '/forgotpassword');
    });

    it('should navigate to the signup page', () => {
        cy.contains('SIGN UP').click();
        cy.url().should('include', '/signup');
    });

    it('should not allow users to login with invalid email', () => {
        const email = '1';
        const password = 'test123';

        cy.get('input[type="email"]').type(email);
        cy.get('input[type="password"]').type(password);
        cy.get('button').contains('LOG IN').click();
        cy.url().should('include', '/');
    });

    it('should not allow users to login with invalid password', () => {
        cy.fixture('loginCredentials').then((loginCredentials) => {
            const email = loginCredentials.email;
            const password = '1';

            cy.get('input[type="email"]').type(email);
            cy.get('input[type="password"]').type(password);
            cy.get('button').contains('LOG IN').click();
            cy.url().should('include', '/');
        });
    });

    it('should redirect to forgot password page when forgot password is clicked', () => {
        cy.contains('Forgot password?').click();
        cy.url().should('include', '/forgotpassword');
    });

    it('should allow users to login with valid credentials and redirect to dashboard', () => {
        cy.fixture('loginCredentials').then((loginCredentials) => {
            const email = loginCredentials.email;
            const password = loginCredentials.password;

            cy.get('input[type="email"]').type(email);
            cy.get('input[type="password"]').type(password);
            cy.get('button').contains('LOG IN').click();
            cy.url().should('include', '/dashboard');

            //logout
            cy.get('.logout-container').click();
        });
    });
});