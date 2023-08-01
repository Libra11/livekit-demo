// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
	it('visits the app root url', () => {
		cy.visit('/')
		cy.contains('h1', 'You did it!')
	})
})

describe('test', () => {
	const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/

	it('visit', () => {
		cy.visit('/')
		cy.contains('About').click()
		cy.url().should('include', '/login')
		cy.get('.input-text').type('libra085925@gmail.com')
		cy.get('.input-text').then((el) => {
			const value = el.val()

			expect(value).to.match(mailReg)
		})
	})
})
