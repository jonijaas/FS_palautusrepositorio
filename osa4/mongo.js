const mongoose = require('mongoose')

if(process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const mongoUrl = `mongodb+srv://fullstack:${password}@cluster0.aq27e.mongodb.net/blogilista?retryWrites=true`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: "Penkkiurheilija",
  author: "Pekka Penkkiurheilija",
  url: 'www.pekanpenkkiurheilu.fi',
  likes: 10
})

blog.save()
  .then(() => {
    console.log('blog saved')
    mongoose.connection.close()
  })