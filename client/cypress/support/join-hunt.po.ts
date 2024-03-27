export class JoinHuntPage {
  private readonly baseUrl = '/hunters';
  private readonly pageTitle = '.title';
  private readonly joinHuntButtonSelector = '[name="join-button"]';
  private readonly accessCodeInputSelector = '.access-code-inputs';
  private readonly accessCodeInput = '.access-code-inputs input';
  private readonly appPageTitle = '.app-title';
  private readonly HomeButton = '[name="home-button"]';
  private readonly HunterButton = '[name="hunter-button"]';

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
  getAccessCodeInputField() {
    return cy.get(this.accessCodeInputSelector);
  }

  /**
   * Type in the access code input field.
   *
   * @param accessCode The access code to type in the input field.
   */
  getAccessCodeInput() {
    return cy.get(this.accessCodeInput);
  }

  /**
   * Get the app page title when visiting the `/app` page.
   *
   * @returns the value of the element with the ID `.app-title`
   */
  getAppTitle(){
    return cy.get(this.appPageTitle);
  }

  /**
   * Get the Home button DOM element.
   *
   * @returns the value of the element with the ID `.home-button`
   */
  getHomeButton(){
    return cy.get(this.HomeButton);
  }

  /**
   * Get the Hunter button DOM element.
   *
   * @returns the value of the element with the class `.hunter-button`
   */
  getHunterButton(){
    return cy.get(this.HunterButton);
  }
}
