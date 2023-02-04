const { Hero } = require('../models/heroes/index')


heroesController = {
	getHeroes: async (req, res, next) => {
		const { name, password } = req.headers

		try {
			hero = new Hero(name, password)
			const results = await hero.getHeroes()

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
			hero = new Hero(name, password)
			const result = await hero.getHero(heroId)

			return res.json(result)
		}
		catch (err) {
			next(err)
		}
	}
}

module.exports = heroesController
