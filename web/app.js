const express = require('express')
const logger = require('./utils/log')

const app = express()
const port = 3000

require('./routes')(app)

app.use((err, req, res, next) => {
	// 統一處理自定義的 error
	if (err.code)
		return res.status(err.code).json({
			code: err.code,
			message: err.message
		})

	logger.error(err)
	res.status(500).json({
		code: 500,
		message: 'server error'
	})
})

app.listen(port, () => {
	logger.info('app is running')
})

module.exports = app
