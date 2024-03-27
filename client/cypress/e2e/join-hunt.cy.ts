import { JoinHuntPage } from '../support/join-hunt.po';

const page = new JoinHuntPage();

describe('Join Hunt', () => {
  beforeEach(() => page.navigateTo());

  it('should display the right title for join hunt page', () => {
    page.getJoinHuntTitle().contains('Type Invite Code');
  });

  it('should display the access code input field', () => {
    page.getAccessCodeInputField().should('exist');
  });

  it('should display the join hunt button', () => {
    page.getJoinHuntButton().should('exist');
    page.getJoinHuntButton().contains('Join Hunt');
  });

  it('should display the join hunt button as disabled with no access code', () => {
    page.getAccessCodeInputField().should('exist');
    page.getAccessCodeInputField().should('have.value', '');
    page.getAccessCodeInput().should('have.value', '');
    page.getJoinHuntButton().should('exist');
    page.getJoinHuntButton().should('have.class', 'mat-mdc-button-disabled');
    // This check if the JoinHuntButton is disabled if there are no access code.
  });

  it('should display the join hunt button as disabled with invalid access code', () => {
    page.getAccessCodeInput().first().type('1');
    page.getAccessCodeInput().eq(1).type('2');
    page.getAccessCodeInput().eq(2).type('3');
    page.getAccessCodeInput().eq(3).type('4');
    // These types in the access code input field.
    page.getJoinHuntButton().should('have.class', 'mat-mdc-button-disabled');
    // This will check if the JoinHuntButton is disabled if invalid access code is entered.
  });

  it('should display the join hunt button as enabled with valid access code', () => {
    page.getAccessCodeInput().first().type('1');
    page.getAccessCodeInput().eq(1).type('2');
    page.getAccessCodeInput().eq(2).type('3');
    page.getAccessCodeInput().eq(3).type('4');
    page.getAccessCodeInput().eq(4).type('5');
    page.getAccessCodeInput().eq(5).type('6');
    // These types in the access code input field.
    page.getJoinHuntButton().should('not.have.class', 'mat-mdc-button-disabled');
    // This will check if the JoinHuntButton is enabled if valid access code (6 digit) is entered.
  });

  it('should not allowed letter in the access code input field', () => {
    page.getAccessCodeInputField().should('exist');
    page.getAccessCodeInput().first().type('a');
    page.getAccessCodeInput().first().should('have.value', '');
    page.getAccessCodeInput().first().type('1');
    page.getAccessCodeInput().first().should('have.value', '1');

    page.getAccessCodeInput().eq(1).type('n');
    page.getAccessCodeInput().eq(1).should('have.value', '');
    page.getAccessCodeInput().eq(1).type('2');
    page.getAccessCodeInput().eq(1).should('have.value', '2');
  });

  it('should navigate to the home app page when the home button is clicked', () => {
    cy.url().should('match', /\/hunters$/);
    page.getHomeButton().click();
    cy.url().should('match', /\/$/);
  });

  it('should navigate to home page then go back to join hunt page', () => {
    page.getHomeButton().click();
    cy.url().should('match', /\/$/);

    page.getHunterButton().click();
    cy.url().should('match', /\/hunters$/);
  })

  it('should navigate to the right hunter view page when join hunt is clicked with valid access code', () => {
    page.getAccessCodeInput().first().type('1');
    page.getAccessCodeInput().eq(1).type('2');
    page.getAccessCodeInput().eq(2).type('3');
    page.getAccessCodeInput().eq(3).type('4');
    page.getAccessCodeInput().eq(4).type('5');
    page.getAccessCodeInput().eq(5).type('6');
    // These types in the access code input field.
    // The access code here is not real, this is just to test that it
    // will navigate to the right page when the join hunt button is clicked.
    page.getJoinHuntButton().click();
    cy.url().should('match', /\/hunter-view\/\d+$/)
  });
});
