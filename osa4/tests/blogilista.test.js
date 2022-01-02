const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')


describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash, _id: '61d1d9605d982fe573e045c3' })
    await user.save()

    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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
    const userLogin = ({ username: 'root', password: 'sekret' })

    const loginResponse = await api
      .post('/api/login')
      .send(userLogin)
    const token = loginResponse.body.token

    const newBlog = {
      title: 'Testing HTTP POST',
      author: 'HTTP POSTER',
      url: 'www.httppostingtest.org',
      likes: 9999
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('Testing HTTP POST')
  })

  test('if a new blogdata has no likes, likes -field is set to 0', async () => {
    const userLogin = ({ username: 'root', password: 'sekret' })

    const loginResponse = await api
      .post('/api/login')
      .send(userLogin)
    const token = loginResponse.body.token

    const newBlog = {
      title: 'Testing HTTP POST',
      author: 'HTTP POSTER',
      url: 'www.httppostingtest.org'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsAtEnd[helper.initialBlogs.length].likes).toBe(0)
  })

  test('if a new blogdata is missing title or url or both, statuscode 400 is returned', async () => {
    const userLogin = ({ username: 'root', password: 'sekret' })

    const loginResponse = await api
      .post('/api/login')
      .send(userLogin)
    const token = loginResponse.body.token

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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutUrl)
      .expect(400)
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutTitle)
      .expect(400)
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutBoth)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if you arent allowed to add blogdata/token is missing', async () => {
    const newBlog = {
      title: 'Testing HTTP POST',
      author: 'HTTP POSTER',
      url: 'www.httppostingtest.org',
      likes: 9999
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'sadasd')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    expect(titles).not.toContain('Testing HTTP POST')
  })

  test('blogdata deleting', async () => {
    const userLogin = ({ username: 'root', password: 'sekret' })

    const loginResponse = await api
      .post('/api/login')
      .send(userLogin)
    const token = loginResponse.body.token

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
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
      likes: 411,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    expect(blogsAtEnd[0].author).toEqual(newBlog.author)
    expect(blogsAtEnd[0].title).toEqual(newBlog.title)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'Testaaja',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username missing or already taken or too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserMissingUsername = {
      name: 'No Username',
      password: 'salainen'
    }

    const newUserNotUnique = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const newUserTooShortUsername = {
      username: 'ro',
      name: 'Super User',
      password: 'salainen'
    }

    let result = await api
      .post('/api/users')
      .send(newUserMissingUsername)
      .expect(400)

    expect(result.body.error).toContain('`username` is required')

    result = await api
      .post('/api/users')
      .send(newUserNotUnique)
      .expect(400)

    expect(result.body.error).toContain('`username` to be unique')

    result = await api
      .post('/api/users')
      .send(newUserTooShortUsername)
      .expect(400)

    expect(result.body.error).toContain('shorter than the minimum allowed')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is missing or too short', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUserMissingPassword = {
      username: 'nopassword',
      name: 'No Password'
    }

    const newUserTooShortPassword = {
      username: 'tooshortpassword',
      name: 'Too Short Password',
      password: 'a'
    }

    let result = await api
      .post('/api/users')
      .send(newUserMissingPassword)
      .expect(400)

    expect(result.body.error).toContain('password missing')

    result = await api
      .post('/api/users')
      .send(newUserTooShortPassword)
      .expect(400)

    expect(result.body.error).toContain('too short')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})