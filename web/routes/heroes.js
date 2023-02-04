const express = require('express')
const router = express.Router()

const heroesController = require('../controllers/heroesController')


router.get('/', heroesController.getHeroes)
router.get('/:heroId', heroesController.getHero)

module.exports = router
