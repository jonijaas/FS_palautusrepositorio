import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageStyle, setMessageStyle] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
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

  const likeBlog = async (event) => {
    const blogToUpdate = blogs.find(b => b.id === event.target.id)
    blogToUpdate.likes = blogToUpdate.likes + 1
    try {
      await blogService.update(blogToUpdate)
      setMessageStyle('notification')
      setMessage(`You liked ${blogToUpdate.title} by ${blogToUpdate.author}`)
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

  const removeBlog = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.autho}`)){
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        setMessageStyle('notification')
        setMessage(`Blog ${blog.title} removed`)
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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    blogService.setToken(null)
    setMessageStyle('notification')
    setMessage('logged out succesfully')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleLogin={handleLogin}
    />
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} style={messageStyle} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} style={messageStyle} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLikeClick={likeBlog} handleRemoveClick={() => removeBlog(blog)} />
      )}
    </div>
  )
}

export default App