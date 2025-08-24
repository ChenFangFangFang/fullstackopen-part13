const router = require('express').Router()
const { Reading, User, Blog } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body

  const user = await User.findByPk(userId)
  const blog = await Blog.findByPk(blogId)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  const reading = await Reading.create({
    user_id: userId,
    blog_id: blogId
  })

  res.json(reading)
})

// PUT /api/readinglists/:id
router.put('/:id', tokenExtractor, async (req, res) => {
  const reading = await Reading.findByPk(req.params.id)
  
  if (!reading) {
    return res.status(404).json({ error: 'Reading not found' })
  }

  // 验证用户是否有权限修改这个阅读记录
  if (reading.user_id !== req.decodedToken.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  reading.read = req.body.read
  await reading.save()
  
  res.json(reading)
})

module.exports = router