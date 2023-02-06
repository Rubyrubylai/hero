const chai = require('chai')
const sinon = require("sinon")
const expect = chai.expect

const externalApi = require('../../utils/externalApi')
const { HeroService } = require('../../services/heroes/index')
const { PermissionDenied, NotFound, ValueError } = require('../../services/error')

const MOCK_NAME = 'NAME'
const MOCK_PASSWORD = 'PASSWORD'
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
		let heroesApiStub

		beforeEach(() => {
			heroesApiStub = sinon.stub(externalApi, 'heroesApi')
			heroesApiStub.returns(Promise.resolve(MOCK_HEROES_DATA))
		})

		afterEach(() => {
			heroesApiStub.restore()
		})

		describe('without name and password', () => {
			it('respond heroes', async () => {
				heroService = new HeroService()
				const heroes = await heroService.getHeroes()

				expect(heroes).to.deep.equal(MOCK_HEROES_DATA.data)
			})
		})

		describe('with name and password', () => {
			let heroProfileApiStub

			beforeEach(() => {
				heroProfileApiStub = sinon.stub(externalApi, 'heroProfileApi')
				heroProfileApiStub.returns(Promise.resolve(MOCK_PROFILE_DATA))
			})

			afterEach(() => {
				heroProfileApiStub.restore()
			})

			describe('get heroes', () => {
				let authApiStub

				before(() => {
					authApiStub = sinon.stub(externalApi, 'authApi')
				})

				after(() => {
					authApiStub.restore()
				})

				it('respond heroes including profile', async () => {
					heroService = new HeroService(MOCK_NAME, MOCK_PASSWORD)
					const heroes = await heroService.getHeroes()

					expect(heroes).to.deep.equal(MOCK_HEROES_WITH_PROFILE_DATA.data)
				})
			})

			describe('get heroes with wrong name', () => {
				let authApiStub

				before(() => {
					const error = {
						response: {
							status: 401,
							data: 'Unauthorized',
						}
					}
					authApiStub = sinon.stub(externalApi, 'authApi').throws(error)
				})

				after(() => {
					authApiStub.restore()
				})

				it('respond unauthorized', async () => {
					heroService = new HeroService('wrongName', MOCK_PASSWORD)
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
					heroService = new HeroService(null, MOCK_PASSWORD)
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
		let heroApiStub

		beforeEach(() => {
			heroApiStub = sinon.stub(externalApi, 'heroApi')
			heroApiStub.returns(Promise.resolve(MOCK_HERO_DATA))
		})

		afterEach(() => {
			heroApiStub.restore()
		})

		describe('without name and password', () => {
			it('respond hero', async () => {
				heroService = new HeroService()
				const hero = await heroService.getHero(1)

				expect(hero).to.deep.equal(MOCK_HERO_DATA.data)
			})
		})

		describe('with name and password', () => {
			let heroProfileApiStub

			beforeEach(() => {
				heroProfileApiStub = sinon.stub(externalApi, 'heroProfileApi')
				heroProfileApiStub.returns(Promise.resolve(MOCK_PROFILE_DATA))
			})

			afterEach(() => {
				heroProfileApiStub.restore()
			})

			describe('get matching hero', () => {
				let authApiStub

				before(() => {
					authApiStub = sinon.stub(externalApi, 'authApi')
				})

				after(() => {
					authApiStub.restore()
				})

				it('respond hero including profile', async () => {
					heroService = new HeroService(MOCK_NAME, MOCK_PASSWORD)
					const hero = await heroService.getHero(1)

					expect(hero).to.deep.equal(MOCK_HERO_WITH_PROFILE_DATA.data)
				})
			})

			describe('get hero with wrong name', () => {
				let authApiStub

				before(() => {
					const error = {
						response: {
							status: 401,
							data: 'Unauthorized',
						}
					}
					authApiStub = sinon.stub(externalApi, 'authApi').throws(error)
				})

				after(() => {
					authApiStub.restore()
				})

				it('respond unauthorized', async () => {
					heroService = new HeroService('wrongName', MOCK_PASSWORD)
					try {
						await heroService.getHero(1)
					}
					catch (err) {
						expect(err).to.deep.equal(new PermissionDenied('your name or password is wrong'))
					}
				})
			})

			describe('get hero with missing name', () => {
				it('respond value error', async () => {
					heroService = new HeroService(null, MOCK_PASSWORD)
					try {
						await heroService.getHero(1)
					}
					catch (err) {
						expect(err).to.deep.equal(new ValueError('name or password is missing'))
					}
				})
			})
		})
	})

	describe('getHero with incorrect heroId', () => {
		let heroApiStub
		const id = 1
		const notFoundMessage = 'Not Found'
		const errorMessage = `id ${id}: ${notFoundMessage}`

		describe('without name and password', () => {
			beforeEach(() => {
				const error = {
					response: {
						status: 404,
						data: notFoundMessage
					}
				}
				heroApiStub = sinon.stub(externalApi, 'heroApi').throws(error)
			})

			afterEach(() => {
				heroApiStub.restore()
			})

			it('respond not found', async () => {
				heroService = new HeroService()
				try {
					await heroService.getHero(id)
				}
				catch (err) {
					expect(err).to.deep.equal(new NotFound(errorMessage))
				}
			})
		})

		describe('with name and password', () => {
			let authApiStub

			beforeEach(() => {
				authApiStub = sinon.stub(externalApi, 'authApi')
				heroApiStub = sinon.stub(externalApi, 'heroApi').throws(new NotFound(errorMessage))
				heroProfileApiStub = sinon.stub(externalApi, 'heroProfileApi').throws(new NotFound(errorMessage))
			})

			afterEach(() => {
				authApiStub.restore()
				heroApiStub.restore()
				heroProfileApiStub.restore()
			})

			it('respond not found', async () => {
				heroService = new HeroService(MOCK_NAME, MOCK_PASSWORD)
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
