const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce(((sum, item) => sum + item.likes), 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }

  let favoriteBlog = blogs[0]

  blogs.forEach(blog => {
    if(blog.likes > favoriteBlog.likes){
      favoriteBlog = blog
    }
  })
  return favoriteBlog
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) {
    return 0
  }

  const lodashBlogs = _(blogs)
    .groupBy('author')
    .map((items, key) => ({ author: key, blogs: items.length }))
    .value()

  const mostBlogs = _.maxBy(lodashBlogs, 'blogs')
  return mostBlogs
}

const mostLikes = (blogs) => {
  if(blogs.length === 0){
    return 0
  }

  const lodashBlogs = _(blogs)
    .groupBy('author')
    .map((items, key) => ({ author: key, likes: _.sumBy(items, 'likes') }))
    .value()

  const mostLiked = _.maxBy(lodashBlogs, 'likes')
  return mostLiked
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}