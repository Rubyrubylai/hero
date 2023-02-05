const chai = require('chai')
const sinon = require("sinon")
const expect = chai.expect

const externalApi = require('../../utils/externalApi')
const { HeroService } = require('../../services/heroes/index')
const { PermissionDenied, NotFound, ValueError } = require('../../services/error')

const NAME = 'hahow'
const PASSWORD = 'rocks'
const MOCK_HERO_DATA = {
	data: {
		id: '1',
		name: 'Daredevil',
		image: 'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg',
	}
}
const MOCK_HEROES_DATA = {
	data: [MOCK_HERO_DATA.data]
}
const MOCK_PROFILE_DATA = {
	data: {
		str: 2,
		int: 7,
		agi: 9,
		luk: 7,
	}
}
const MOCK_HERO_WITH_PROFILE_DATA = {
	data: {
		...MOCK_HEROES_DATA.data[0],
		profile: {
			str: 2,
			int: 7,
			agi: 9,
			luk: 7,
		}
	}
}
const MOCK_HEROES_WITH_PROFILE_DATA = {
	data: [MOCK_HERO_WITH_PROFILE_DATA.data]
}


describe('Heroes model', () => {

	describe('getHeroes', () => {
		let apiHeroesStub

		beforeEach(() => {
			apiHeroesStub = sinon.stub(externalApi, 'apiHeroes')
			apiHeroesStub.returns(Promise.resolve(MOCK_HEROES_DATA))
		})

		afterEach(() => {
			apiHeroesStub.restore()
		})

		describe('without name and password', () => {
			it('respond heroes', async () => {
				heroService = new HeroService()
				const heroes = await heroService.getHeroes()

				expect(heroes).to.deep.equal(MOCK_HEROES_DATA.data)
			})
		})

		describe('with name and password', () => {
			let apiHeroProfileStub

			beforeEach(() => {
				apiHeroProfileStub = sinon.stub(externalApi, 'apiHeroProfile')
				apiHeroProfileStub.returns(Promise.resolve(MOCK_PROFILE_DATA))
			})

			afterEach(() => {
				apiHeroProfileStub.restore()
			})

			describe('get heroes', () => {
				let apiAuthStub

				before(() => {
					apiAuthStub = sinon.stub(externalApi, 'apiAuth')
				})

				after(() => {
					apiAuthStub.restore()
				})

				it('respond heroes including profile', async () => {
					heroService = new HeroService(NAME, PASSWORD)
					const heroes = await heroService.getHeroes()

					expect(heroes).to.deep.equal(MOCK_HEROES_WITH_PROFILE_DATA.data)
				})
			})

			describe('get heroes with wrong name', () => {
				let apiAuthStub

				before(() => {
					const error = {
						response: {
							status: 401,
							data: 'Unauthorized',
						}
					}
					apiAuthStub = sinon.stub(externalApi, 'apiAuth').throws(error)
				})

				after(() => {
					apiAuthStub.restore()
				})

				it('respond unauthorized', async () => {
					heroService = new HeroService('wrongName', PASSWORD)
					try {
						await heroService.getHeroes()
					}
					catch (err) {
						expect(err).to.deep.equal(new PermissionDenied('your name or password is wrong'))
					}
				})
			})

			describe('get heroes with missing name', () => {
				it('respond value error', async () => {
					heroService = new HeroService(null, PASSWORD)
					try {
						await heroService.getHeroes()
					}
					catch (err) {
						expect(err).to.deep.equal(new ValueError('name or password is missing'))
					}
				})
			})
		})
	})

	describe('getHero', () => {
		let apiHeroStub

		beforeEach(() => {
			apiHeroStub = sinon.stub(externalApi, 'apiHero')
			apiHeroStub.returns(Promise.resolve(MOCK_HERO_DATA))
		})

		afterEach(() => {
			apiHeroStub.restore()
		})

		describe('without name and password', () => {
			it('respond hero', async () => {
				heroService = new HeroService()
				const hero = await heroService.getHero(1)

				expect(hero).to.deep.equal(MOCK_HERO_DATA.data)
			})
		})

		describe('with name and password', () => {
			let apiHeroProfileStub

			beforeEach(() => {
				apiHeroProfileStub = sinon.stub(externalApi, 'apiHeroProfile')
				apiHeroProfileStub.returns(Promise.resolve(MOCK_PROFILE_DATA))
			})

			afterEach(() => {
				apiHeroProfileStub.restore()
			})

			describe('get matching hero', () => {
				let apiAuthStub

				before(() => {
					apiAuthStub = sinon.stub(externalApi, 'apiAuth')
				})

				after(() => {
					apiAuthStub.restore()
				})

				it('respond hero including profile', async () => {
					heroService = new HeroService(NAME, PASSWORD)
					const hero = await heroService.getHero()

					expect(hero).to.deep.equal(MOCK_HERO_WITH_PROFILE_DATA.data)
				})
			})

			describe('get hero with wrong name', () => {
				let apiAuthStub

				before(() => {
					const error = {
						response: {
							status: 401,
							data: 'Unauthorized',
						}
					}
					apiAuthStub = sinon.stub(externalApi, 'apiAuth').throws(error)
				})

				after(() => {
					apiAuthStub.restore()
				})

				it('respond unauthorized', async () => {
					heroService = new HeroService('wrongName', PASSWORD)
					try {
						await heroService.getHero()
					}
					catch (err) {
						expect(err).to.deep.equal(new PermissionDenied('your name or password is wrong'))
					}
				})
			})

			describe('get hero with missing name', () => {
				it('respond value error', async () => {
					heroService = new HeroService(null, PASSWORD)
					try {
						await heroService.getHero()
					}
					catch (err) {
						expect(err).to.deep.equal(new ValueError('name or password is missing'))
					}
				})
			})
		})
	})

	describe('getHero with incorrect heroId', () => {
		let apiHeroStub
		const id = 1
		const notFoundMessage = 'Not Found'

		describe('without name and password', () => {
			beforeEach(() => {
				const error = {
					response: {
						status: 404,
						data: notFoundMessage
					}
				}
				apiHeroStub = sinon.stub(externalApi, 'apiHero').throws(error)
			})

			afterEach(() => {
				apiHeroStub.restore()
			})

			it('respond not found', async () => {
				heroService = new HeroService()
				try {
					await heroService.getHero(id)
				}
				catch (err) {
					expect(err).to.deep.equal(new NotFound(`id ${id}: ${notFoundMessage}`))
				}
			})
		})

		describe('with name and password', () => {
			let apiAuthStub
			let errorMessage = `id ${id}: ${notFoundMessage}`

			beforeEach(() => {
				apiAuthStub = sinon.stub(externalApi, 'apiAuth')
				apiHeroStub = sinon.stub(externalApi, 'apiHero').throws(new NotFound(errorMessage))
				apiHeroProfileStub = sinon.stub(externalApi, 'apiHeroProfile').throws(new NotFound(errorMessage))
			})

			afterEach(() => {
				apiAuthStub.restore()
				apiHeroStub.restore()
				apiHeroProfileStub.restore()
			})

			it('respond not found', async () => {
				heroService = new HeroService(NAME, PASSWORD)
				try {
					await heroService.getHero(id)
				}
				catch (err) {
					expect(err).to.deep.equal(new NotFound(errorMessage))
				}
			})
		})
	})
})
