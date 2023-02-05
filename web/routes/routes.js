const express = require('express')
const router = express.Router()

router.get('*', (req, res) => {
	return res.redirect('/heroes')
})

module.exports = router
