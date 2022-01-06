describe('Blog app', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Joni',
      username: 'test',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    const user2 = {
      name: 'Other user',
      username: 'test2',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.visit('http://localhost:3000')
    cy.contains('Log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Joni logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('test')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Joni logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'test', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type('Testing Cypress')
      cy.get('#author').type('Test User')
      cy.get('#url').type('www.testingcypress123.org')
      cy.get('#create-button').click()

      cy.contains('Testing Cypress Test User')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Testing Cypress',
          author: 'Test User',
          url: 'www.testingcypress123.org'
        })
      })

      it('A blog can be liked', function() {
        cy.contains('view').click()
        cy.contains('likes 0')
          .contains('like')
          .click()

        cy.contains('likes 1')
      })

      it('A blog can be deleted by user who created it', function() {
        cy.contains('view').click()
        cy.contains('Testing Cypress Test User')
        cy.contains('remove').click()

        cy.get('.notification').should('contain', 'Blog Testing Cypress removed')
        cy.get('html').should('not.contain', 'Testing Cypress Test User')
      })

      it('A blog cannot be deleted by user who didnt create it', function() {
        cy.contains('logout').click()
        cy.login({ username: 'test2', password: 'salainen' })
        cy.contains('Other user logged in')

        cy.contains('view').click()
        cy.contains('Testing Cypress Test User')
        cy.contains('remove').should('have.css', 'display', 'none')

        cy.contains('remove').click({ force: true })
        cy.get('.error').should('contain', 'Error: Request failed with status code 401')
      })
    })

    describe('and several blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test1', author:'Tester One', url:'testerone.org' })
        cy.createBlog({ title: 'Test2', author:'Tester Two', url:'testertwo.org' })
        cy.createBlog({ title: 'Test3', author:'Tester Three', url:'testerthree.org' })
      })

      it('blogs are sorted correctly by likes', function() {
        cy.contains('Test1 Tester One').parent().as('test1')
        cy.contains('Test2 Tester Two').parent().as('test2')
        cy.contains('Test3 Tester Three').parent().as('test3')

        cy.get('@test1').contains('view').click()
        cy.get('@test2').contains('view').click()
        cy.get('@test3').contains('view').click()

        cy.get('.blogDiv:first').should('contain', 'Test1')
        cy.get('.blogDiv:last').should('contain', 'Test3')

        cy.get('@test3').contains('like').click()
        cy.get('@test3').contains('like').click()
        cy.get('@test3').contains('like').click()
        cy.get('@test2').contains('like').click()
        cy.get('@test2').contains('like').click()
        cy.get('@test1').contains('like').click()
        cy.wait(1000)

        cy.get('@test3').should('contain', 'likes 3')
        cy.get('@test2').should('contain', 'likes 2')
        cy.get('@test1').should('contain', 'likes 1')

        cy.get('.blogDiv:first').should('contain', 'Test3')
        cy.get('.blogDiv:last').should('contain', 'Test1')
      })
    })
  })
})