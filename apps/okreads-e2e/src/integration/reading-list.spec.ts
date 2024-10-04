describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should able to add the book to reading list', () => {
    // cy.get('input[type="search"]').type('javascript');
    // cy.get('form').submit();
    // cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
    // cy.get('.want-btn-0').click();
    // cy.get('.want-btn-0').should('be.disabled');

    // cy.get('[data-testing="toggle-reading-list"]').click();
    // cy.get('.reading-list-item').should('have.length.greaterThan', 1);

    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
    cy.get('.want-btn-0').click();
    cy.get('.want-btn-0').should('be.disabled')
    cy.get('.want-btn-1').click();
    cy.get('.want-btn-1').should('be.disabled')
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('.reading-list-item').should('have.length.greaterThan', 1);
});

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should see my reading list and update the status', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
    cy.get('.reading-list-item').should('have.length.greaterThan', 1);
    cy.get('.finished-btn-0').click()
    cy.get('.date-0').should('be.visible')
  });
});
