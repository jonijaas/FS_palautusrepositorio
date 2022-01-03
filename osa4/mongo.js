const mongoose = require('mongoose')

if(process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const mongoUrl = MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'TESTI',
  author: 'Tero Testaaja',
  url: 'www.terotestaa.fi',
  likes: 10000
})

blog.save()
  .then(() => {
    console.log('blog saved')
    mongoose.connection.close()
  })
