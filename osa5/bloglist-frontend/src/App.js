import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [messageStyle, setMessageStyle] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setNewAuthor('')
      setNewTitle('')
      setNewUrl('')
      setMessageStyle('notification')
      setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessageStyle('error')
      setMessage(`Error: ${exception.message}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessageStyle('notification')
      setMessage('logged in succesfully')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessageStyle('error')
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
    setMessageStyle('notification')
    setMessage('logged out succesfully')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} style={messageStyle} />
        <form onSubmit={handleLogin}>
          <div>
            username
              <input type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
              <input type='password' value={password} name='Password' onChange={({ target}) => setPassword(target.value)} />
          </div>
          <button type='submit'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} style={messageStyle} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <h3>create new</h3>
      <form onSubmit={addBlog}>
        <div>title <input value={newTitle} onChange={handleTitleChange} /></div>
        <div>author <input value={newAuthor} onChange={handleAuthorChange} /></div>
        <div>url <input value={newUrl} onChange={handleUrlChange} /></div>
        <button type='submit'>create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App