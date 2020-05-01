/// <reference types="cypress" />

describe('Auth', () => {
  beforeEach(() => {
    cy.visit('https://wardrobe.rocks');
    cy.logout();
  });

  it('has welcome text', () => {
    cy.contains('Welcome to Wardrobe');
  });

  // it('can sign up new user', () => {
  //   cy.contains('SIGN UP').click();
  //   cy.contains('Sign up to Wardrobe');

  //   cy.get('input[type="email"]').type('cypress-e2e-testing@wardrobe.rocks');
  //   cy.get('input#display-name').type('Cypress E2E');
  //   cy.get('input#password-input').type('Cypress123Pass*^!Word@#&');
  //   cy.get('input#password-verified').type('Cypress123Pass*^!Word@#&');
  //   cy.get('button.signUpButton').click();

  //   cy.contains('Design');
  //   cy.contains('Add Clothes');
  //   cy.contains('Random');
  // });

  it('can login', () => {
    cy.contains('LOGIN').click();
    cy.contains('Login to Wardrobe');
    cy.get('input[type="email"]').type('cypress-e2e-testing@wardrobe.rocks');
    cy.get('input[type="password"]').type('Cypress123Pass*^!Word@#&');
    cy.get('button.loginbutton').click();

    cy.contains('Design');
    cy.contains('Add Clothes');
    cy.contains('Random');
  });

  it('can logout', () => {
    cy.login();
    cy.get('header .user').click();
    cy.contains('Logout').click();
    cy.contains('Welcome to Wardrobe');
  });
});
