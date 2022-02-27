import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  return (
    <div>
      <h3>create new</h3>
      <Form onSubmit={addBlog}>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            id="title"
            placeholder="title"
            value={newTitle}
            onChange={handleTitleChange}
          />
          <Form.Label>author</Form.Label>
          <Form.Control
            id="author"
            placeholder="author"
            value={newAuthor}
            onChange={handleAuthorChange}
          />
          <Form.Label>url</Form.Label>
          <Form.Control
            id="url"
            placeholder="url"
            value={newUrl}
            onChange={handleUrlChange}
          />
          <Button variant="success" id="create-button" type="submit">
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

BlogForm.propTypes = { createBlog: PropTypes.func.isRequired }

export default BlogForm
