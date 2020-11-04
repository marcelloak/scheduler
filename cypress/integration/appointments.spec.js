describe("Appoinments", () => {

  beforeEach(() => {
    // reset test database
    cy.request('GET', 'localhost:8001/api/debug/reset')
    cy.visit("/");
    cy.contains('Monday');
  })

  it('should book an interview', () => {
    // 1. click add
    cy.get('[alt=Add]').first().click();

    // 2. input name and interviewer
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');
    cy.get("[alt='Sylvia Palmer']").click();

    // 3. save
    cy.contains("Save").click();

    // 4. check that saving worked
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it('should edit an interview', () => {
    // 1. click edit
    cy.get('[alt=Edit]').click({force: true});

    // 2. change name and interviewer
    cy.get('[data-testid=student-name-input]').clear().type('Lydia Miller-Jones');
    cy.get("[alt='Tori Malcolm']").click();

    // 3. save
    cy.contains("Save").click();

    // 4. check that editing worked
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it('should cancel an interview', () => {
    // 1. click delete and confirm
    cy.get('[alt=Delete]').click({force: true});
    cy.contains('Confirm').click();

    // 2. check that deleting worked
    cy.contains("Deleting");
    cy.contains("Deleting").should('not.exist');
    cy.contains(".appointment__card--show", "Archie Cohen").should('not.exist');
  });
  
});