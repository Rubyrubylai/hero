const express = require('express')

const app = express()
const port = 3000

require('./routes')(app)

app.use((err, req, res, next) => {
	res.status(500).json({
		error: 'server error'
	})
})

app.listen(port, () => {
	console.log('app is running')
})
