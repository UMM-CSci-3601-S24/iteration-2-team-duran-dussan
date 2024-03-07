export class HuntProfilePage {
  private readonly baseUrl = '/hosts';
  private readonly huntCardSelector = '.hunt-card';
  private readonly profileButtonSelector = '[data-test=viewProfileButton]';
  private readonly taskSelector = '.task-line';
  private readonly hostCardSelector = '.hunt-cards-container app-hunt-card';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly button = '[data-test=addTaskButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

   getHuntCard() {
    return cy.get(this.huntCardSelector);
  }

  getHuntCards() {
    return cy.get(this.hostCardSelector);
  }

  getTasks() {
    return cy.get(this.taskSelector);
  }

  deleteHunt() {
    cy.get('[data-test=removeHuntButton]').click();
    return cy.get('[data-test=confirmDeleteHuntButton]').click();
  }

  deleteTask() {
    cy.get('[data-test=removeTaskButton]').first().click();
    return cy.get('[data-test=confirmDeleteTaskButton]').click();
  }

  addTaskButton() {
    return cy.get(this.button);
  }

  confirmAddTaskButton() {
    return cy.get('[data-test=confirmAddTaskButton]');
  }

  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }

  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>(this.profileButtonSelector).click();
  }
}
