module.exports = (app) => {
	app.use('/heroes', require('./heroes'))
	app.use('/', require('./routes'))
}
