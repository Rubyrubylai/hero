const axios = require('axios')

const hahowRequest = axios.create({
	baseURL: 'https://hahow-recruit.herokuapp.com'
})


externalApi = {
	heroesApi: () => hahowRequest.get('/heroes'),
	heroApi: heroId => hahowRequest.get(`/heroes/${heroId}`),
	heroProfileApi: heroId => hahowRequest.get(`/heroes/${heroId}/profile`),
	authApi: (name, password) => hahowRequest.post('/auth', {
		name: name,
		password: password,
	}),
}

module.exports = externalApi
