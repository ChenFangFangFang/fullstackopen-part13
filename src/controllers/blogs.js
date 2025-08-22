const router = require('express').Router()
const { Blog } = require('../models')

// GET /api/blogs
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

// POST /api/blogs
router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body)
  res.json(blog)
})

// DELETE /api/blogs/:id
router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

// PUT /api/blogs/:id
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (typeof req.body.likes !== 'number') {
    return res.status(400).json({ error: 'likes must be a number' })
  }

  blog.likes = req.body.likes
  await blog.save()
  res.json(blog)
})

module.exports = router