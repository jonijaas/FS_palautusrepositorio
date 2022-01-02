const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body

  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!request.user){
    return response.status(401).json({ error: 'user missing or invalid' })
  }

  const user = request.user

  if(!body.title || !body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      user: user._id,
      url: body.url,
      likes: body.likes || 0
    })
    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog.toJSON())
    } catch (exception){
      next(exception)
    }
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (!request.user){
    return response.status(401).json({ error: 'user missing or invalid' })
  }

  const user = request.user
  const removableBlog = await Blog.findById(request.params.id)

  if(removableBlog.user.toString() === user.id.toString()) {
    try{
      await Blog.findByIdAndRemove(removableBlog.id)
      response.status(204).end()
    } catch (exception){
      next(exception)
    }
  } else {
    return response.status(401).json({ error: 'you are not allowed to delete blog if you arent created it' })
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  if(!body.title || !body.url) {
    response.status(400).end()
  } else {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    }
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.status(200)
      response.json(updatedBlog.toJSON())
    } catch (exception){
      next(exception)
    }
  }
})

module.exports = blogsRouter