import { BeginHuntPage } from "cypress/support/begin-hunt.po";

const page = new BeginHuntPage();

describe('Begin Hunt', () => {
  beforeEach(() => {
    page.navigateTo();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
    });
    cy.task('seed:database');
  });

  it('should click the begin hunt and navigate to the right access code page', () => {
    page.beginHuntButton().should('exist');
    page.beginHuntButton().click();
    page.getAccessCode().then((accessCode) => {
      cy.wait(2000);
      cy.url().should('eq', `http://localhost:4200/startedHunts/${accessCode}`);
    });
  })

  it('should click the Begin Hunt button again to start the hunt', () => {

  })
})
