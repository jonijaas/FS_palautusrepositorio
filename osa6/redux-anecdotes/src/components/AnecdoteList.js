import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification, removeNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const anecdotesSorted = [...anecdotes]
  anecdotesSorted.sort((a, b) => b.votes - a.votes)
  const anecdotesFiltered = anecdotesSorted.filter((a) => a.content.toLowerCase().includes(filter.text.toLowerCase()))

  const handleVoteClick = ( event ) => {
    dispatch(voteAnecdote(event.target.id))
    dispatch(setNotification(`you voted '${event.target.value}'`))
    setTimeout(() => {dispatch(removeNotification())}, 5000)
  }
  
  return (
    <div>
      {anecdotesFiltered.map(anecdote => 
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button id={anecdote.id} value={anecdote.content} onClick={handleVoteClick}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}


export default AnecdoteList