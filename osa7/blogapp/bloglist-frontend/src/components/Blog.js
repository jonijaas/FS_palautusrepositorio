import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Blog = ({ blog, handleLikeClick, handleRemoveClick, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5,
  }
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showIfAllowed = {
    display: blog.user.username === user.username ? '' : 'none',
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className="blogDiv" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <Button
          variant="primary"
          size="sm"
          style={hideWhenVisible}
          onClick={toggleVisibility}
        >
          view
        </Button>
        <Button
          variant="secondary"
          size="sm"
          style={showWhenVisible}
          onClick={toggleVisibility}
        >
          hide
        </Button>
      </div>
      <div style={showWhenVisible} className="expandable">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}{' '}
          <Button
            variant="success"
            size="sm"
            id={blog.id}
            onClick={handleLikeClick}
          >
            like
          </Button>
        </div>
        <div>{blog.user.name || ''}</div>
        <Button
          variant="danger"
          size="sm"
          style={showIfAllowed}
          onClick={handleRemoveClick}
        >
          remove
        </Button>
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
