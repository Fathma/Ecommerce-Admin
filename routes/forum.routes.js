const router = require('express').router()
const forum = require('../controllers/forum.controller')


router.get('/posts', forum.getPosts)

module.exports = router