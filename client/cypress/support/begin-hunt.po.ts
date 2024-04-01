export class BeginHuntPage {
  private readonly baseUrl = '/hosts';
  private readonly BeginHuntButton = '.begin-hunt';
  private readonly hostCardSelector = '.hunt-cards-container app-hunt-card';
  private readonly profileButtonSelector = '[data-test=viewProfileButton]';
  private readonly huntAccessCode = '.access-code-number';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  /**
   * @returns The begin hunt button
   */
  beginHuntButton() {
    return cy.get(this.BeginHuntButton);
  }

  /**
   * @returns The hunt cards on host page
   */
  getHuntCards() {
    return cy.get(this.hostCardSelector);
  }

  /**
   * @returns click view profile button on card
   */
  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>(this.profileButtonSelector).click();
  }

  /**
   * Get the access code from the started Hunt.
   * Requires begin Hunt in the "hunt" view as hosts.
   *
   * @returns the value of the element with the class `.col-md-12 Access Code`
   */
  getAccessCode() {
    return cy.get(this.huntAccessCode).invoke('text').as('accessCode');
  }
}
