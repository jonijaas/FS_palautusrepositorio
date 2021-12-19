import React, { useState, useEffect} from "react"
import axios from "axios"

const Countries = ({ countryData, handleClick }) => {
  if(countryData.length > 10){
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if(countryData.length > 1) {
    return (
      <div>
          {countryData.map(part => <p key={part.name.official}>{part.name.common}<button onClick={handleClick} id={part.name.common}>show</button></p>)}
      </div>
    )
  } else {
    return (
      <>
        {countryData.map(part => <Country key={part.name.official} country={part} />)}
      </>
    )
  }
}

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p><b>Capital:</b> {country.capital}</p>
      <p><b>Population:</b> {country.population}</p>
      <h3>Spoken languages:</h3>
      <ul>
        {Object.values(country.languages).map(part => <li key={part}>{part}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" height="100" />
      <Weather capital={country.capital} />
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState({})
  const [ready, setReady] = useState(false)
  const api_key = process.env.REACT_APP_API_KEY
  useEffect(() => {
    axios
      .get("http://api.weatherstack.com/current?access_key=" + api_key + "&query=" + capital)
      .then(response => {
        setWeather(response.data.current)
        setReady(true)
      })
  }, [])

  if(!ready){
    return (
      <p>Loading...</p>
    )
  }
  
  return (
    <>
      <h3>Weather in {capital}</h3>
      <p><b>Temperature: </b>{weather.temperature} Celsius</p>
      <p><b>Wind: </b> {weather.wind_speed} mph, direction {weather.wind_dir}</p>
      <p><i>{weather.weather_descriptions}</i></p>
      <img src={weather.weather_icons} alt="weather_icon" />
    </>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState("")

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const showCountries = newSearch === ""
    ? countries
    : countries.filter(country => 
        country.name.common.toUpperCase().includes(newSearch.toUpperCase())
      )

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const handleShowClick = (event) => {
    setNewSearch(event.target.id)
  }

  return (
    <div>
      find countries<input value={newSearch} onChange={handleSearchChange}></input>
      <Countries countryData={showCountries} handleClick={handleShowClick} />
    </div>
  )
}

export default App;
