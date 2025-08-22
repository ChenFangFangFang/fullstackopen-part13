const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../utils/db')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
    raw: true
  })

  res.json(authors.map(author => ({
    author: author.author,
    articles: String(author.articles),
    likes: String(author.likes || 0)
  })))
})

module.exports = router
