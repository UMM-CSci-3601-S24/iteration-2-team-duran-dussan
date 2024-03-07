import { HuntProfilePage } from "cypress/support/hunt-profile.po";


const page = new HuntProfilePage();

describe('Hunt Profile', () => {
  beforeEach(() => {
    page.navigateTo();
    page.getHuntCards().first().then(() => {
      page.clickViewProfile(page.getHuntCards().first());
    });
    cy.task('seed:database');
  });

  it('should display the title', () => {
    page.getHuntCard().contains('Default Hunt 1');
  });

  it('should display a task', () => {
    page.getTasks().contains('Take a picture of');
  });

  describe('Adding a new task and deleting hunts and tasks', () => {

    it('should add a task', () => {
      page.addTaskButton().should('be.visible').click();
      page.confirmAddTaskButton().should('be.disabled');
      page.getFormField('name').type('Test');
      page.confirmAddTaskButton().should('be.enabled').click();
      page.getTasks().last().contains('Test');
    });

    it('should delete a task', () => {
      page.deleteTask();
      page.getTasks().first().contains('Take a picture of a bird');
    });

    it('should delete a hunt', () => {
      page.deleteHunt();
      cy.url()
        .should('match', /\/hosts/)
        .should('not.match', /\/hunts\/[0-9a-fA-F]{24}$/);
    });

  });

});
