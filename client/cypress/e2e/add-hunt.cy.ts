import { AddHuntPage } from "cypress/support/add-hunt.po";
import { Hunt } from "src/app/hunts/hunt";


describe('Add Hunt', () => {
  const page = new AddHuntPage();

  beforeEach(() => page.navigateTo());

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Hunt');
  });

  it('Should enable and disable the add hunt button', () => {
    page.addHuntButton().should('be.disabled');
    page.getFormField('name').type('Test');
    page.addHuntButton().should('be.disabled');
    page.getFormField('description').type('Test');
    page.addHuntButton().should('be.disabled');
    page.getFormField('est').type('1');
    page.addHuntButton().should('be.enabled');
    page.getFormField('est').clear();
    page.addHuntButton().should('be.disabled');
  });

  it('Should show error messages for invalid inputs', () => {
    cy.get('[data-test=nameError]').should('not.exist');
    page.getFormField('name').click().blur();
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
    page.getFormField('name').type('This is a very long name that goes over the character limit at least I hope it does');
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
    page.getFormField('name').clear().type('Test');
    cy.get('[data-test=nameError]').should('not.exist');

    const longString = 'a'.repeat(205);
    cy.get('[data-test=descriptionError]').should('not.exist');
    page.getFormField('description').click().blur();
    cy.get('[data-test=descriptionError]').should('exist').and('be.visible');
    page.getFormField('description').type(longString);
    cy.get('[data-test=descriptionError]').should('exist').and('be.visible');
    page.getFormField('description').clear().type('Test');
    cy.get('[data-test=descriptionError]').should('not.exist');

    cy.get('[data-test=estError]').should('not.exist');
    page.getFormField('est').click().blur();
    cy.get('[data-test=estError]').should('exist').and('be.visible');
    page.getFormField('est').type('5').blur();
    cy.get('[data-test=estError]').should('not.exist');
    page.getFormField('est').clear().type('500').blur();
    cy.get('[data-test=estError]').should('exist').and('be.visible');
    page.getFormField('est').clear().type('asd').blur();
    cy.get('[data-test=estError]').should('exist').and('be.visible');
    page.getFormField('est').clear().type('25').blur();
    cy.get('[data-test=estError]').should('not.exist');
  });

  describe('Adding a new hunt', () => {

    beforeEach(() => {
      cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
      const hunt: Hunt = {
        _id: null,
        hostId: "someId",
        name: 'Test',
        description: 'Test',
        est: 25,
        numberOfTasks: 0,
      };

      page.addHunt(hunt);

      cy.url()
        .should('match', /\/hunts\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/hunts\/new$/);

        cy.get('.hunt-card-name').should('have.text', hunt.name);
        cy.get('.hunt-card-description').should('have.text', hunt.description);
        cy.get('.hunt-card-time').should('contain.text', hunt.est.toString());
        cy.get('.hunt-card-task').should('contain.text', hunt.numberOfTasks.toString());

        page.getSnackBar().should('contain', `Added hunt ${hunt.name}`);
    });
  });
});
