export class JoinHuntPage {
  private readonly baseUrl = '/hunters';
  private readonly pageTitle = '.title';
  private readonly joinHuntButtonSelector = '[name="join-button"]';
  private readonly accessCodeInputSelector = '.access-code-inputs';
  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  /**
   * Gets the title of the app when visiting the `/join-hunt` page.
   *
   * @returns the value of the element with the ID `.join-hunt-title`
   */
  getJoinHuntTitle() {
    return cy.get(this.pageTitle);
  }

/**
 * Get the join-hunt button DOM element.
 *
 * @returns an iterable (`Cypress.Chainable`) containing the `join-hunt` DOM element.
 */
  getJoinHuntButton() {
    return cy.get(this.joinHuntButtonSelector);
  }

  /**
   * Get the access code input field DOM element.
   *
   * @returns an iterable (`Cypress.Chainable`) containing the `access-code-input` DOM element.
   */
  getAccessCodeInput() {
    return cy.get(this.accessCodeInputSelector);
  }
}
