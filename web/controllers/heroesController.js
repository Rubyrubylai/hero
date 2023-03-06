const { HeroService } = require('../services/heroes/index')


heroesController = {
	getHeroes: async (req, res, next) => {
		const { name, password } = req.headers

		try {
			const heroService = new HeroService(name, password)
			const results = await heroService.getHeroes()

			return res.json(results)
		}
		catch (err) {
			next(err)
		}
	},

	getHero: async (req, res, next) => {
		const { name, password } = req.headers
		const heroId = req.params.heroId

		try {
			const heroService = new HeroService(name, password)
			const result = await heroService.getHero(heroId)

			return res.json(result)
		}
		catch (err) {
			next(err)
		}
	}
}

module.exports = heroesController
