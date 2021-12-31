const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(b => b.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if(!body.title || !body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0
    })
    try {
      const savedBlog = await blog.save()
      response.status(201).json(savedBlog.toJSON())
    } catch (exception){
      next(exception)
    }
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try{
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception){
    next(exception)
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