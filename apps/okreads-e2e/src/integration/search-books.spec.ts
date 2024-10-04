describe('When: Use the search feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should be able to search books by title', () => {
    cy.get('input[type="search"]').type('javascript');

    cy.get('form').submit();

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
  });

  xit('Then: I should see search results as I am typing', () => {
    // TODO: Implement this test!
  });

  it('should add a book to the reading list and undo the action via snackbar', () => {
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);

    cy.get('.want-to-btn-0').click();
    cy.get('.mat-simple-snackbar-action > button', { timeout: 10000 }).should('be.visible');
    cy.get('.mat-simple-snackbar-action > button').click();

    cy.get('.want-to-btn-0').should('be.enabled');
  });

});
