export class AppPage {

  private readonly baseUrl = '/';
  private readonly titleSelector = '.app-title';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getAppTitle() {
    return cy.get(this.titleSelector);
  }
}
