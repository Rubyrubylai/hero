const externalApi = require('../utils/externalApi')


heroesController = {
	getHeroes: async(req, res) => {
		try {
			const result = await externalApi.apiHeroes()

			return res.json(result.data)
		}
		catch (err) {
			next(err)
		}
	},

	getHero: async(req, res, next) => {
		try {
			const result = await externalApi.apiHero(req.params.heroId)

			return res.json(result.data)
		}
		catch (err) {
			if (err.response.data == 'Not Found')
				return res.json({})

			next(err)
		}
	}
}

module.exports = heroesController
