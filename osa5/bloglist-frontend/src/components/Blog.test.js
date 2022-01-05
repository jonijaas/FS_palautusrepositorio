import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog /> testing', () => {
  let component
  const handleLikeClick = jest.fn()
  const handleRemoveClick = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'Testing',
      author: 'Frontend Tester',
      url: 'www.testingfrontend.org',
      user: { name: 'Backend Tester', username: 'backend' },
      likes: 500,
    }

    const user = {
      name: 'Frontend Tester',
      username: 'frontend',
      id: '007'
    }

    component = render(
      <Blog blog={blog} handleLikeClick={handleLikeClick} handleRemoveClick={handleRemoveClick} user={user} />
    )
  })

  test('renders title and author (not url/likes/user) of blogs', () => {
    expect(component.container).toHaveTextContent('Testing Frontend Tester')
    const expandableDiv = component.container.querySelector('.expandable')
    expect(expandableDiv).toHaveStyle('display: none')
  })

  test('when clicking the view button, all info are shown', () => {
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)

    const expandableDiv = component.container.querySelector('.expandable')
    expect(expandableDiv).not.toHaveStyle('display: none')
  })

  test('clicking the like button 2 times, correct function is called twice', () => {
    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(handleLikeClick.mock.calls).toHaveLength(2)
  })

})