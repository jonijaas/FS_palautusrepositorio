const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('correct amount of blogs and correct format(json)', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('correct identifying field(id)', async () => {
  const response = await api.get('/api/blogs')
  for (let b of response.body) {
    expect(b.id).toBeDefined()
  }
})

test('a new valid blogdata can be added', async () => {
  const newBlog = {
    title: 'Testing HTTP POST',
    author: 'HTTP POSTER',
    url: 'www.httppostingtest.org',
    likes: 9999
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(titles).toContain('Testing HTTP POST')
})

test('if a new blogdata has no likes, likes -field is set to 0', async () => {
  const newBlog = {
    title: 'Testing HTTP POST',
    author: 'HTTP POSTER',
    url: 'www.httppostingtest.org'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogsAtEnd[helper.initialBlogs.length].likes).toBe(0)
})

test('if a new blogdata is missing title or url or both, statuscode 400 is returned', async () => {
  const newBlogWithoutUrl = {
    title: 'Testing HTTP POST',
    author: 'HTTP POSTER',
    likes: 400
  }
  const newBlogWithoutTitle = {
    author: 'HTTP POSTER',
    url: 'www.httppostingtest.org',
    likes: 240
  }
  const newBlogWithoutBoth = {
    author: 'HTTP POSTER',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlogWithoutUrl)
    .expect(400)
  await api
    .post('/api/blogs')
    .send(newBlogWithoutTitle)
    .expect(400)
  await api
    .post('/api/blogs')
    .send(newBlogWithoutBoth)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('blogdata deleting', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).not.toContain(blogToDelete.title)
})

test('blogdata updating', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const newBlog = {
    id: blogToUpdate.id,
    title: 'Testing HTTP POST',
    author: 'HTTP POSTER',
    url: 'www.httppostingtest.org',
    likes: 411
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  expect(blogsAtEnd[0]).toEqual(newBlog)
})

afterAll(() => {
  mongoose.connection.close()
})