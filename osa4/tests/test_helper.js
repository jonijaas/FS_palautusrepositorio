const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Testing part one',
    author: 'Test Testerone',
    url: 'www.testingone.fi',
    likes: 100
  },
  {
    title: 'Testing part two',
    author: 'Test Testertwo',
    url: 'www.testingtwo.org',
    likes: 200
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb
}