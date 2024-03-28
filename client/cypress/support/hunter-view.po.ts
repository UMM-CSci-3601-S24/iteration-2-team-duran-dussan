export class HunterViewPage {
  private readonly baseUrl = '/hunters';

  navigateTo() {
    return cy.visit(this.baseUrl);
  }


}
