require('dotenv').config()
const { UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/Book')
const User = require('./models/User')

const JWT_SECRET = process.env.SECRET

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return await Book.find({}).populate('author')
      }
      if (!args.author) {
        return await Book.find({ genres: { $in: args.genre } }).populate(
          'author'
        )
      }
      if (!args.genre) {
        const fAuthor = await Author.findOne({ name: args.author })
        return await Book.find({ author: fAuthor.id }).populate('author')
      }
      const fAuthor = await Author.findOne({ name: args.author })
      return await Book.find({
        author: fAuthor.id,
        genres: { $in: args.genre },
      }).populate('author')
    },
    allAuthors: async () => {
      return Author.find({})
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      const fAuthor = await Author.findOne({ name: root.name })
      const booksByAuthor = await Book.find({ author: fAuthor.id })
      return booksByAuthor.length
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const fAuthor = await Author.findOne({ name: args.author })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      try {
        if (!fAuthor) {
          const cAuthor = new Author({ name: args.author })
          await cAuthor.save()
          const book = new Book({ ...args, author: cAuthor })
          await book.save()
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
        } else {
          const book = new Book({ ...args, author: fAuthor })
          await book.save()
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return book
        }
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const fAuthor = await Author.findOne({ name: args.name })

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      if (!fAuthor) {
        return null
      }
      fAuthor.born = args.setBornTo
      try {
        return await fAuthor.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })
      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
