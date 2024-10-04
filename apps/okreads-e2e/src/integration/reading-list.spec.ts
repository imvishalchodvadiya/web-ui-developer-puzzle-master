describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

 it('should add a book to the reading list and undo the action via snackbar', () => {
  cy.get('input[type="search"]').type('javascript');

  cy.get('form').submit();

  cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);

  cy.get('.want-to-btn-0').click();
  cy.get('.want-to-btn-0').should('be.disabled');
  cy.get('[data-testing="toggle-reading-list"]').click();
  cy.get('.reading-list-item').should('have.length.at.least', 1);
  cy.get('.remove-btn-0').click();
  cy.get('.mat-simple-snackbar-action > button').focused();
  cy.get('.mat-simple-snackbar-action > button').click();
  cy.get('.reading-list-item').should('have.length.at.least', 1);
});


  it('should clear the selected book from the reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('.remove-btn-0').click();
  });
});
