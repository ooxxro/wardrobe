import 'cypress-file-upload';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  cy.visit('https://wardrobe.rocks/login');
  cy.get('input[type="email"]').type('cypress-e2e-testing@wardrobe.rocks');
  cy.get('input[type="password"]').type('Cypress123Pass*^!Word@#&');
  cy.get('button.loginbutton').click();
  cy.contains('Design');
});

Cypress.Commands.add('logout', () => {
  cy.visit('https://wardrobe.rocks');
  cy.get('header').then($header => {
    if (!$header.text().includes('LOGIN')) {
      cy.get('header .user').click();
      cy.contains('Logout').click({ waitForAnimations: false });
    }
  });
});
