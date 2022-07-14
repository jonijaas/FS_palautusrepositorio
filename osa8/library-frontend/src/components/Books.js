import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ALL_BOOKS_GENRE } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('all genres')
  const [showBooks, setShowBooks] = useState([])
  const [genres, setGenres] = useState([])

  const result = useQuery(ALL_BOOKS)

  const genreResult = useQuery(ALL_BOOKS_GENRE, {
    variables: { genre },
  })

  useEffect(() => {
    if (result.data) {
      const cGenres = result.data.allBooks.map((a) => a.genres).flat(1)
      const genres = [...new Set(cGenres)]
      setGenres(genres)
    }
  }, [result.data])

  useEffect(() => {
    if (result.data && genreResult.data) {
      if (genre === 'all genres') {
        setShowBooks(result.data.allBooks)
      } else {
        setShowBooks(genreResult.data.allBooks)
      }
    }
  }, [genreResult.data, result.data, genre])

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      <div>in genre: {genre}</div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {showBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre('all genres')} key="all genres">
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books
