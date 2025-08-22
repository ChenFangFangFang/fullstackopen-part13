const Blog = require('./blog')

Blog.sync({ alter: true })

module.exports = { Blog }