/// <reference types="cypress" />

describe('All Routes', () => {
  before(() => {
    cy.logout();
    cy.login();
  });

  beforeEach(() => {
    cy.get('header>a').click();
  });

  it('can go to my-wardrobe', () => {
    cy.get('a.my-wardrobe').click();
    cy.contains('My wardrobe');

    cy.contains('ALL').click();
    cy.contains('Sort By');
    cy.go('back');
    cy.contains('My wardrobe');

    cy.contains('Hats').click();
    cy.contains('Sort By');
    cy.go('back');
    cy.contains('My wardrobe');

    cy.contains('Shirts').click();
    cy.contains('Sort By');
    cy.go('back');
    cy.contains('My wardrobe');

    cy.contains('Pants').click();
    cy.contains('Sort By');
    cy.go('back');
    cy.contains('My wardrobe');

    cy.contains('Shoes').click();
    cy.contains('Sort By');
    cy.go('back');
    cy.contains('My wardrobe');

    // add clothes
    cy.contains('+ Add Clothes').click();
    cy.contains('Upload clothes image');
    cy.go('back');
    cy.contains('My wardrobe');
  });

  it('can go to clothes detail', () => {
    cy.get('a.my-wardrobe').click();
    cy.contains('My wardrobe');

    cy.contains('ALL').click();
    cy.contains('Sort By');

    cy.get('.imgs-wrapper>a')
      .first()
      .click();
    cy.contains('Date added:');
    cy.contains('Date modified:');
  });

  it('can go to design', () => {
    cy.contains('Design').click();
    cy.contains('Design');
    cy.contains('Random');
    cy.contains('Save');
  });

  it('can go to my-favorite', () => {
    cy.get('a.my-favorite').click();
    cy.contains('My favorites');
    cy.contains('Filter');
  });

  it('can go to Add Clothes', () => {
    cy.contains('Add Clothes').click();
    cy.contains('Add clothes');
    cy.contains('Upload clothes image');
  });

  it('can go to Random', () => {
    cy.contains('Random').click();
    cy.contains('Random');
    cy.contains('Filter');
    cy.contains('Done');
  });

  it('can go to setting', () => {
    cy.get('header .user').click();
    cy.contains('Settings').click({ waitForAnimations: false });
    cy.contains('Account Settings');
  });
});
