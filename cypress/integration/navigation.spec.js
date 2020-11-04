describe("Navigation", () => {

  it('should navigate to Tuesday', () => {
    cy.visit("/");

    // 1. click tuesday and check that it switched
    cy.contains('[data-testid=day]', 'Tuesday')
      .click()
      .should('have.class', 'day-list__item--selected');
  });
  
});