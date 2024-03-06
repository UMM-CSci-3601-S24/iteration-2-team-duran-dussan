import { HostProfilePage } from "cypress/support/host-profile.po";

const page = new HostProfilePage();

describe('Host Profile', () => {
  beforeEach(() => page.navigateTo());

  it('should display the title', () => {
    page.getHostTitle().contains('Hunts');
  });

  it('should display host cards', () => {
    page.getHuntCards().should('have.length.greaterThan', 0);
  });

  it('Should click view profile on a hunt and go to the right URL in card view', () => {
    page.getHuntCards().first().then(() => {

      page.clickViewProfile(page.getHuntCards().first());

      cy.url().should('match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });
  });

  it('Should click the add hunt button and go to the right URL', () => {
    page.addHuntButton().click();
    cy.url().should(url => expect(url.endsWith('/hunts/new')).to.be.true);
    cy.get('.add-hunt-title').should('have.text', 'New Hunt');
  });
});
