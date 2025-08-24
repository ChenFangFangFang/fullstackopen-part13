const router = require('express').Router()
const { User, Blog, Reading } = require('../models')

// GET /api/users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const readStatus = req.query.read
  const where = { user_id: req.params.id }
  
  if (readStatus === 'true' || readStatus === 'false') {
    where.read = readStatus === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      through: { attributes: [] },
      attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
      include: {
        model: Reading,
        as: 'readinglists',
        attributes: ['id', 'read'],
        where,
        required: true
      }
    }
  })

  if (!user) {
    return res.status(404).end()
  }

  const formattedUser = {
    name: user.name,
    username: user.username,
    readings: user.readings.map(blog => ({
      id: blog.id,
      url: blog.url,
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
      year: blog.year,
      readinglists: blog.readinglists || []
    }))
  }

  res.json(formattedUser)
})

// POST /api/users
router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

// PUT /api/users/:username
router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router