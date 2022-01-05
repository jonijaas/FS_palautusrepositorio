import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm /> testing', () => {
  const createBlog = jest.fn()
  let component

  beforeEach(() => {
    component = render(
      <BlogForm createBlog={createBlog} />
    )
  })

  test('when creating a blog, callback function has right values', () => {
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, { target: { value: 'Testing(title)' } })
    fireEvent.change(author, { target: { value: 'Testing(author)' } })
    fireEvent.change(url, { target: { value: 'Testing(url)' } })
    fireEvent.submit(form)

    expect(createBlog.mock.calls[0][0].title).toBe('Testing(title)')
    expect(createBlog.mock.calls[0][0].author).toBe('Testing(author)')
    expect(createBlog.mock.calls[0][0].url).toBe('Testing(url)')
    expect(createBlog.mock.calls).toHaveLength(1)
  })
})