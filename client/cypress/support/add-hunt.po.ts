import { Hunt } from 'src/app/hunts/hunt';

export class AddHuntPage {

  private readonly url = '/hunts/new';
  private readonly title = '.add-hunt-title';
  private readonly button = '[data-test=confirmAddHuntButton]';
  private readonly snackBar = '.mat-mdc-simple-snack-bar';
  private readonly nameFieldName = 'name';
  private readonly descriptionFieldName = 'description';
  private readonly estFieldName = 'est';
  private readonly formFieldSelector = `mat-form-field`;

  navigateTo() {
    return cy.visit(this.url);
  }

  getTitle() {
    return cy.get(this.title);
  }

  addHuntButton() {
    return cy.get(this.button);
  }

  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }

  getSnackBar() {
    return cy.get(this.snackBar);
  }

  addHunt(newHunt: Hunt) {
    this.getFormField(this.nameFieldName).type(newHunt.name);
    this.getFormField(this.descriptionFieldName).type(newHunt.description.toString());
    this.getFormField(this.estFieldName).type(newHunt.est.toString());
    return this.addHuntButton().click();
  }
}
