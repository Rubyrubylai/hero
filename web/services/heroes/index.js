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
		await this.currentState.auth(this.name, this.password)
	}

	async getHeroes() {
		const heroes = await this.currentState.getHeroes()
		return heroes
	}

	async getHero(id) {
		const hero = await this.currentState.getHero(id)
		return hero
	}
}

class State {
	constructor(heroService) {
		this.heroService = heroService
	}
}

class NormalSate extends State {
	async getHeroes() {
		const heroesResult = await externalApi.heroesApi()
		if (heroesResult.data.code) {
			throw new Error(heroesResult.data.message)
		}

		return heroesResult.data
	}

	async getHero(id) {
		try {
			const heroResult = await externalApi.heroApi(id)
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

			await externalApi.authApi(name, password)
		}
		catch (err) {
			if (err.response && err.response.status === 401)
				throw new PermissionDenied('your name or password is wrong')

			throw err
		}
	}

	async getHeroes() {
		// 驗證帳號及密碼
		await this.heroService.auth()

		const heroesResult = await externalApi.heroesApi()
		const heroes = heroesResult.data

		// 取得各個 hero 的 profile 資訊
		let tasks = []
		let heroIds = []
		for (let hero of heroes) {
			tasks.push(externalApi.heroProfileApi(hero.id))
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

			// heroIds 與 Promise 回傳陣列中值的順序相同，依序取得 heroId 及 profile 的對應
			idProfileMap[heroIds[idx]] = result.value.data
		})

		for (let hero of heroes) {
			hero['profile'] = idProfileMap[hero['id']]
		}

		return heroes
	}

	async getHero(id) {
		// 驗證帳號及密碼
		await this.heroService.auth()

		let tasks = [
			externalApi.heroApi(id),
			externalApi.heroProfileApi(id),
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
}


module.exports = {
	HeroService,
}
