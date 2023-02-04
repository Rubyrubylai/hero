module.exports = (app) => {
	app.use('/heroes', require('./heroes'))
}
