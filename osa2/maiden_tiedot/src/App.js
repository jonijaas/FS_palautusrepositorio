import React, { useState, useEffect} from "react"
import axios from "axios"

const Countries = ({ countryData }) => {
  if(countryData.length > 10){
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if(countryData.length > 1) {
    return (
      <div>
          {countryData.map(part => <p key={part.name.official}>{part.name.common}</p>)}
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
  console.log(country.flags)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(part => <li key={part}>{part}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" height="150" />
    </div>
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

  return (
    <div>
      find countries<input value={newSearch} onChange={handleSearchChange}></input>
      <Countries countryData={showCountries} />
    </div>
  )
}

export default App;
