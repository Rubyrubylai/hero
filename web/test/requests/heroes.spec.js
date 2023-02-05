const request = require('supertest')
const chai = require('chai')
const expect = chai.expect

const app = require('../../app')

const NAME = 'hahow'
const PASSWORD = 'rocks'
const HERO_DATA = {
	id: '1',
	name: 'Daredevil',
	image: 'http://i.annihil.us/u/prod/marvel/i/mg/6/90/537ba6d49472b/standard_xlarge.jpg',
}
const HERO_WITH_PROFILE_DATA = {
	...HERO_DATA,
	profile: {
		str: 2,
		int: 7,
		agi: 9,
		luk: 7,
	},
}


describe('Heroes API', () => {

	describe('GET /heroes', () => {
		it('respond heroes', (done) => {
			request(app)
				.get('/heroes')
				.set('Accept', 'application/json')
				.expect(200)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const results = JSON.parse(res.text)
					expect(results[0]).to.have.deep.property('id', HERO_DATA.id)
					expect(results[0]).to.have.deep.property('name', HERO_DATA.name)
					expect(results[0]).to.have.deep.property('image', HERO_DATA.image)

					expect(results[0]).to.not.have.property('profile')

					done()
				})
		})

		it('respond heroes including profile', (done) => {
			request(app)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('name', NAME)
				.set('password', PASSWORD)
				.expect(200)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const results = JSON.parse(res.text)
					expect(results[0]).to.deep.equal(HERO_WITH_PROFILE_DATA)

					done()
				})
		})

		it('wrong name, so respond unauthorized', (done) => {
			request(app)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('name', 'wrongName')
				.set('password', PASSWORD)
				.expect(401)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('your name or password is wrong')

					done()
				})
		})

		it('wrong password, so respond unauthorized', (done) => {
			request(app)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('name', NAME)
				.set('password', 'wrongPassword')
				.expect(401)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('your name or password is wrong')

					done()
				})
		})

		it('missing name, so respond value error', (done) => {
			request(app)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('password', PASSWORD)
				.expect(400)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('name or password is missing')

					done()
				})
		})

		it('missing password, so respond value error', (done) => {
			request(app)
				.get('/heroes')
				.set('Accept', 'application/json')
				.set('name', NAME)
				.expect(400)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('name or password is missing')

					done()
				})
		})
	})

	describe('GET /heroes/:heroId', () => {
		it('respond with matching hero', (done) => {
			request(app)
				.get('/heroes/1')
				.set('Accept', 'application/json')
				.expect(200)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result).to.deep.equal(HERO_DATA)

					done()
				})
		})

		it('respond with matching hero including profile', (done) => {
			request(app)
				.get('/heroes/1')
				.set('Accept', 'application/json')
				.set('name', NAME)
				.set('password', PASSWORD)
				.expect(200)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result).to.deep.equal(HERO_WITH_PROFILE_DATA)

					done()
				})
		})

		it('wrong heroId, so respond not found', (done) => {
			request(app)
				.get('/heroes/5')
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('id 5: Not Found')

					done()
				})
		})

		it('wrong name, so respond unauthorized', (done) => {
			request(app)
				.get('/heroes/1')
				.set('Accept', 'application/json')
				.set('name', 'wrongName')
				.set('password', PASSWORD)
				.expect(401)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('your name or password is wrong')

					done()
				})
		})

		it('wrong password, so respond unauthorized', (done) => {
			request(app)
				.get('/heroes/1')
				.set('Accept', 'application/json')
				.set('name', NAME)
				.set('password', 'wrongPassword')
				.expect(401)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('your name or password is wrong')

					done()
				})
		})

		it('missing name, so respond value error', (done) => {
			request(app)
				.get('/heroes/1')
				.set('Accept', 'application/json')
				.set('password', PASSWORD)
				.expect(400)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('name or password is missing')

					done()
				})
		})

		it('missing password, so respond value error', (done) => {
			request(app)
				.get('/heroes/1')
				.set('Accept', 'application/json')
				.set('name', NAME)
				.expect(400)
				.expect('Content-Type', /json/)
				.end((err, res) => {
					if (err) return done(err)

					const result = JSON.parse(res.text)
					expect(result.message).to.equal('name or password is missing')

					done()
				})
		})
	})

})
