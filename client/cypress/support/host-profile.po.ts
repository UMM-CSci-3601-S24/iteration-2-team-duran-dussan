export class HostProfilePage {
  private readonly baseUrl = '/hosts';
  private readonly pageTitle = '.hunt-list-title';
  private readonly hostCardSelector = '.hunt-cards-container app-hunt-card';
  private readonly profileButtonSelector = '[data-test=viewProfileButton]';
  private readonly addHuntButtonSelector = '[data-test=addHuntButton]';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  /**
   * Gets the title of the app when visiting the `/hosts` page.
   *
   * @returns the value of the element with the ID `.host-list-title`
   */
  getHostTitle() {
    return cy.get(this.pageTitle);
  }

  /**
   * Get all the `app-host-card` DOM elements. This will be
   * empty if we're using the list view of the hosts.
   *
   * @returns an iterable (`Cypress.Chainable`) containing all
   *   the `app-host-card` DOM elements.
   */
   getHuntCards() {
    return cy.get(this.hostCardSelector);
  }

  /**
   * Clicks the "view profile" button for the given host card.
   * Requires being in the "card" view.
   *
   * @param card The host card
   */
  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>(this.profileButtonSelector).click();
  }

  addHuntButton() {
    return cy.get(this.addHuntButtonSelector);
  }
}
