import { JoinHuntPage } from '../support/join-hunt.po';

const page = new JoinHuntPage();

describe('Join Hunt', () => {
  beforeEach(() => page.navigateTo());

  it('should display the right title for join hunt page', () => {
    page.getJoinHuntTitle().contains('Type Invite Code');
  });

  it('should display the access code input field', () => {
    page.getAccessCodeInput().should('exist');
  });

  it('should display the join hunt button', () => {
    page.getJoinHuntButton().should('exist');
    page.getJoinHuntButton().contains('Join Hunt');
  });

  // it('should display the join hunt button as disabled with no access code', () => {
  //   page.getAccessCodeInput().should('exist');
  //   page.getAccessCodeInput().should('have.value', '');
  //   page.getJoinHuntButton().should('exist');
  //   page.getJoinHuntButton().should();
  // });
});
