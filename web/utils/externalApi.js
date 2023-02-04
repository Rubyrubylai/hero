const axios = require('axios')

const hahowRequest = axios.create({
	baseURL: 'https://hahow-recruit.herokuapp.com'
})


externalApi = {
	apiHeroes: () => hahowRequest.get('/heroes'),
	apiHero: heroId => hahowRequest.get(`/heroes/${heroId}`),
	apiHeroProfile: heroId => hahowRequest.get(`/heroes/${heroId}/profile`),
	apiAuth: (name, password) => hahowRequest.post('/auth', {
		name: name,
		password: password,
	}),
}

module.exports = externalApi
