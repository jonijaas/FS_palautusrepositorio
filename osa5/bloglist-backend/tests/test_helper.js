const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Testing part one',
    author: 'Test Testerone',
    url: 'www.testingone.fi',
    likes: 100,
    user: '61d1d9605d982fe573e045c3'
  },
  {
    title: 'Testing part two',
    author: 'Test Testertwo',
    url: 'www.testingtwo.org',
    likes: 200,
    user: '61d1d9605d982fe573e045c3'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}