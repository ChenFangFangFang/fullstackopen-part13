const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { User, Session } = require('../models')
const { SECRET } = require('../utils/config')
const { tokenExtractor } = require('../utils/middleware')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: {
      username: username
    }
  })

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled'
    })
  }

  const passwordCorrect = user && password === user.password

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.create({
    userId: user.id,
    token
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

router.delete('/logout', tokenExtractor, async (req, res) => {
  await req.session.destroy()
  res.status(204).end()
})

module.exports = router