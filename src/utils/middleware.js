const jwt = require('jsonwebtoken')
const { Session, User } = require('../models')
const { SECRET } = require('./config')

const errorHandler = (error, request, response, next) => {
  console.error('Error:', error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, SECRET)
      
      const session = await Session.findOne({
        where: { 
          userId: decodedToken.id,
          token: token
        },
        include: {
          model: User,
          attributes: ['disabled']
        }
      })

      if (!session) {
        return res.status(401).json({ error: 'session expired' })
      }

      if (session.user.disabled) {
        return res.status(401).json({ error: 'account disabled' })
      }

      req.decodedToken = decodedToken
      req.session = session
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor
}