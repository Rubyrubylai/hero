const express = require('express')

const app = express()
const port = 3000

app.get('/', (req, res) => {
	return res.send('hedddlol ddworld')
})

app.listen(port, () => {
	console.log('app is running')
})
