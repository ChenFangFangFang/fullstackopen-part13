const Blog = require('./blog')
const User = require('./user')
const Reading = require('./reading')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { 
  through: Reading,
  foreignKey: 'user_id',
  as: 'readings'
})

Blog.belongsToMany(User, { 
  through: Reading,
  foreignKey: 'blog_id',
  as: 'readers'
})

Blog.hasMany(Reading, { as: 'readinglists' })
Reading.belongsTo(Blog, { foreignKey: 'blog_id' })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = { Blog, User, Reading, Session }