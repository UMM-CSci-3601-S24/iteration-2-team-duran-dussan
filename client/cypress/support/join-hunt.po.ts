export class JoinHuntPage {
  private readonly baseUrl = '/join-hunt';
  private readonly pageTitle = '.join-hunt-title';
  private readonly joinHuntButtonSelector = '[data-test=joinHuntButton]';

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
}
