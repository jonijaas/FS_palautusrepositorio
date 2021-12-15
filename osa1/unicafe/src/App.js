import React, { useState } from "react"

const Statistics = ({ good, neutral, bad }) => {
  if ( (good + neutral + bad) === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={good + neutral + bad} />
        <StatisticLine text="average" value={(good * 1 + neutral * 0 + bad * (-1)) / (good + neutral + bad)} />
        <StatisticLine text="positive" value={((good / (good + neutral + bad)) * 100)} unit="%" />
      </tbody>
    </table>
  )
}

const StatisticLine = ( { text, value, unit }) => {
  return (
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
      <td>{unit}</td>
    </tr>
  )
}

const Button = ( { handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good +1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App;
 