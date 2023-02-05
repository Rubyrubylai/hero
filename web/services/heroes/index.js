const externalApi = require('../../utils/externalApi')
const { ValueError, PermissionDenied, NotFound } = require('../error')


class HeroService {
	AuthState = new AuthState(this)
	NormalSate = new NormalSate(this)
	currentState = this.NormalSate

	constructor(name, password) {
		this.name = name
		this.password = password
		if (name || password) {
			this.currentState = this.AuthState
		}
	}

	async auth() {
		try {
			await this.currentState.auth(this.name, this.password)
		}
		catch (err) {
			throw err
		}
	}

	async getHeroes() {
		try {
			const heroes = await this.currentState.getHeroes()
			return heroes
		}
		catch (err) {
			throw err
		}
	}

	async getHero(id) {
		try {
			const hero = await this.currentState.getHero(id)
			return hero
		}
		catch(err) {
			throw err
		}
	}
}

class State {
	constructor(hero) {
		this.hero = hero
	}
}

class NormalSate extends State {
	async getHeroes() {
		try {
			const heroesResult = await externalApi.apiHeroes()
			if (heroesResult.data.code) {
				throw new Error(heroesResult.data.message)
			}

			return heroesResult.data
		}
		catch (err) {
			throw err
		}
	}

	async getHero(id) {
		try {
			const heroResult = await externalApi.apiHero(id)
			if (heroResult.data.code) {
				throw new Error(heroResult.data.message)
			}

			return heroResult.data
		}
		catch (err) {
			if (err.response && err.response.status === 404)
				throw new NotFound(`id ${id}: ${err.response.data}`)

			throw err
		}
	}
}

// 有帶入帳號及密碼，則多取得 profile 資訊
class AuthState extends State {
	async auth(name, password) {
		try {
			if (!(name && password)) {
				throw new ValueError('name or password is missing')
			}

			await externalApi.apiAuth(name, password)
		}
		catch (err) {
			if (err.response && err.response.data === 'Unauthorized')
				throw new PermissionDenied('your name or password is wrong')

			throw err
		}
	}

	async getHeroes() {
		try {
			// 驗證帳號及密碼
			await this.hero.auth()

			const heroesResult = await externalApi.apiHeroes()
			const heroes = heroesResult.data

			// 取得各個 hero 的 profile 資訊
			let tasks = []
			let heroIds = []
			for (let hero of heroes) {
				tasks.push(externalApi.apiHeroProfile(hero.id))
				heroIds.push(hero.id)
			}
			const heroProfileResults = await Promise.allSettled(tasks)

			let idProfileMap = {}
			heroProfileResults.forEach((result, idx) => {
				if (result.status === 'rejected') {
					throw new NotFound(result.reason.response.data)
				}

				if (result.value.data.code) {
					throw new Error(result.value.data.message)
				}

				// 根據陣列的推入順序，依序取得 id 及 profile 的對應
				idProfileMap[heroIds[idx]] = result.value.data
			})

			for (let hero of heroes) {
				hero['profile'] = idProfileMap[hero['id']]
			}

			return heroes
		}
		catch (err) {
			throw err
		}
	}

	async getHero(id) {
		try {
			// 驗證帳號及密碼
			await this.hero.auth()

			let tasks = [
				externalApi.apiHero(id),
				externalApi.apiHeroProfile(id),
			]
			const heroResults = await Promise.allSettled(tasks)

			heroResults.forEach(result => {
				if (result.status === 'rejected') {
					throw new NotFound(`id ${id}: ${result.reason.response.data}`)
				}

				if (result.value.data.code) {
					throw new Error(result.value.data.message)
				}
			})

			let hero = heroResults[0].value.data
			let heroProfile = heroResults[1].value.data
			hero['profile'] = heroProfile

			return hero
		}
		catch (err) {
			throw err
		}
	}
}


module.exports = {
	HeroService,
}
