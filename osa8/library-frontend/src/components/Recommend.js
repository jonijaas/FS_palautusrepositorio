import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS_GENRE, ME } from '../queries'

const Recommend = (props) => {
  const [genre, setGenre] = useState('')
  const [books, setBooks] = useState([])

  const meResult = useQuery(ME)
  const result = useQuery(ALL_BOOKS_GENRE, { variables: { genre } })

  useEffect(() => {
    if (meResult.data) {
      setGenre(meResult.data.me.favoriteGenre)
    }
  }, [meResult])

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  if (!props.show) {
    return null
  }
  if (meResult.loading || result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>recommendations</h2>

      <div>books in your favorite genre: {genre}</div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
