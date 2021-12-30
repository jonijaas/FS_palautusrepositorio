require('dotenv').config()

let PORT = process.env.PORT
let MONGOD_URI = process.env.MONGODB_URI

module.exports = {
  MONGOD_URI,
  PORT
}