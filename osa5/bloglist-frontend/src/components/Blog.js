import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLikeClick, handleRemoveClick, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showIfAllowed = { display: blog.user.username === user.username ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className='blogDiv' style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
        <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      </div>
      <div style={showWhenVisible} className='expandable'>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button id={blog.id} onClick={handleLikeClick}>like</button>
        </div>
        <div>{blog.user.name || ''}</div>
        <button style={showIfAllowed} onClick={handleRemoveClick}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikeClick: PropTypes.func.isRequired,
  handleRemoveClick: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog