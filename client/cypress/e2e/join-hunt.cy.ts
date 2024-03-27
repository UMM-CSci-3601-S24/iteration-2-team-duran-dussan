import { JoinHuntPage } from '../support/join-hunt.po';

const page = new JoinHuntPage();

describe('Join Hunt', () => {
  beforeEach(() => page.navigateTo());

  it('should display the right title for join hunt page', () => {
    page.getJoinHuntTitle().contains('Join Hunt');
  });
})
