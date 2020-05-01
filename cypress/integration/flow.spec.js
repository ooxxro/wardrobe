/// <reference types="cypress" />

describe('Main Flow', () => {
  before(() => {
    cy.logout();
    cy.login();
  });
  beforeEach(() => {
    cy.get('header>a').click();
  });

  it('add clothes, design, random, favorite, edit, delete', () => {
    /**************************
     * add clothes
     */
    cy.contains('Add Clothes').click();

    // choose image...
    cy.get('input[type="file"]').attachFile('test-clothes.png');
    // cy.fixture('test-clothes.png').then(fileContent => {
    //   cy.get('input[type="file"]').upload({
    //     fileContent: fileContent.toString(),
    //     fileName: 'testPicture.png',
    //     mimeType: 'image/png',
    //   });
    // });

    cy.contains('BACK', { matchCase: false });
    cy.contains('NEXT', { matchCase: false }).click();

    cy.contains('Drag and resize clothes to fit mannequin');
    cy.get('input[type="checkbox"][name="lockAspectRatio"]').uncheck();
    cy.get('img.clothes')
      .trigger('mousedown')
      .trigger('mousemove', { clientX: 484, clientY: 145 })
      .trigger('mouseup', { force: true });

    cy.contains('NEXT', { matchCase: false }).click();
    cy.contains('Hats').click();

    cy.contains(' New Tag').click();
    cy.get('.tags input[type="text"]').type('this tag will be removed{enter}');
    cy.contains('this tag will be removed');

    cy.get('.tags input[type="text"]').type('testing{enter}');
    cy.contains('testing');
    cy.get('.tags input[type="text"]').type('cowboy{enter}');
    cy.contains('cowboy');

    cy.contains('this tag will be removed')
      .find('.anticon-close')
      .click();

    cy.contains('FINISH', { matchCase: false }).click();
    cy.contains('Continue Adding Clothes');
    cy.contains('Go to Design').click();

    /**************************
     * add clothes
     */
    cy.contains('Design');
    cy.contains('Save');
    cy.contains('hats').click();
    cy.contains('shirts').click();
    cy.contains('pants').click();
    cy.contains('shoes').click();

    cy.contains('hats').click();
    cy.get('.ant-tabs-tabpane-active img')
      .first()
      .click();
    cy.contains('shirts').click();
    cy.get('.ant-tabs-tabpane-active img')
      .first()
      .click();
    cy.contains('pants').click();
    cy.get('.ant-tabs-tabpane-active img')
      .first()
      .click();
    cy.contains('shoes').click();
    cy.get('.ant-tabs-tabpane-active img')
      .first()
      .click();

    cy.contains('shirts').click();
    cy.contains('Random').click();
    cy.contains('Random').click();
    cy.contains('Random').click();

    cy.get('button.lock').click();
    cy.get('.lockItem input[type="checkbox"]')
      .eq(2)
      .check();
    cy.get('.MuiPopover-root').click();
    cy.contains('Random').click();
    cy.contains('Random').click();
    cy.contains('Random').click();

    cy.get('button.filter').click();
    cy.get('.filterItem input[type="checkbox"]')
      .eq(0)
      .check();
    cy.get('.filterItem input[type="checkbox"]')
      .eq(3)
      .check();
    cy.get('.filterItem input[type="checkbox"]')
      .eq(8)
      .check();

    cy.get('.filterItem input[type="checkbox"]')
      .eq(3)
      .uncheck();
    cy.get('.filterItem input[type="checkbox"]')
      .eq(0)
      .uncheck();
    cy.get('.filterItem input[type="checkbox"]')
      .eq(8)
      .uncheck();
    cy.get('.MuiPopover-root').click();

    cy.get('button.undo').click();
    cy.get('button.undo').click();

    cy.contains('Save').click();
    cy.contains('Download').click();
    cy.contains('Save to My Favorites').click();

    /********************
     * My Favorites
     */
    cy.get('button[aria-label="Next image"]').click();
    cy.get('button[aria-label="Next image"]').click();
    cy.get('button[aria-label="Next image"]').click();
    cy.get('button[aria-label="Previous image"]').click();
    cy.get('button[aria-label="Previous image"]').click();
    cy.get('button[aria-label="Previous image"]').click();

    cy.get('button[aria-label="Zoom in"]').click();
    cy.get('button[aria-label="Zoom in"]').click();
    cy.get('button[aria-label="Zoom out"]').click();
    cy.get('button[aria-label="Zoom out"]').click();

    cy.get('button[aria-label="Close lightbox"]').click();
    cy.contains('My favorites');
    // TODO buggy
    cy.get('.loading+img').click();

    cy.get('.lightbox-menubar-button')
      .eq(3)
      .click();
    cy.get('.lightbox-menubar-button')
      .eq(2)
      .click();
    cy.contains('Are you sure');
    cy.contains('you want to delete this outfit?');
    cy.contains('Yes').click();
    cy.contains('My favorites');

    /**************
     * clothes edit
     */
    cy.get('header>a').click();
    cy.contains('Design');
    cy.get('a.my-wardrobe').click();
    cy.contains('My wardrobe');

    cy.contains('Hats').click();
    cy.contains('Sort By').click();
    cy.contains('Date Added').click();

    cy.get('.imgs-wrapper>a')
      .first()
      .click();

    cy.contains('Date added:');
    cy.get('.deleteButton').click();
    cy.contains('you want to delete this clothes?');
    cy.contains('Yes').click();
    cy.contains('Sort By');

    /*******
     * random
     */
    cy.get('header>a').click();
    cy.contains('Random').click();
    cy.contains('Random').click();
    cy.contains('Random').click();
    cy.contains('Random').click();
    cy.contains('Random').click();
    cy.contains('Done').click();
  });
});
