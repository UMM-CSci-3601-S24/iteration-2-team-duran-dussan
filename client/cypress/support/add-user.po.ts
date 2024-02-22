import { User } from 'src/app/users/user';

export class AddUserPage {

  private readonly url = '/users/new';
  private readonly title = '.add-user-title';
  private readonly button = '[data-test=confirmAddUserButton]';
  private readonly snackBar = '.mat-mdc-simple-snack-bar';
  private readonly nameFieldName = 'name';
  private readonly ageFieldName = 'age';
  private readonly companyFieldName = 'company';
  private readonly emailFieldName = 'email';
  private readonly formFieldSelector = `mat-form-field`;
  private readonly dropDownSelector = `mat-option`;

  navigateTo() {
    return cy.visit(this.url);
  }

  getTitle() {
    return cy.get(this.title);
  }

  addUserButton() {
    return cy.get(this.button);
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    // Find and click the drop down
    return select.click()
      // Select and click the desired value from the resulting menu
      .get(`${this.dropDownSelector}[value="${value}"]`).click();
  }

  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }

  getSnackBar() {
    return cy.get(this.snackBar);
  }

  addUser(newUser: User) {
    this.getFormField(this.nameFieldName).type(newUser.name);
    this.getFormField(this.ageFieldName).type(newUser.age.toString());
    if (newUser.company) {
      this.getFormField(this.companyFieldName).type(newUser.company);
    }
    if (newUser.email) {
      this.getFormField(this.emailFieldName).type(newUser.email);
    }
    this.selectMatSelectValue(this.getFormField('role'), newUser.role);
    return this.addUserButton().click();
  }
}
