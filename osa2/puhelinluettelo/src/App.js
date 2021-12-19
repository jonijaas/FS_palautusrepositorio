import React, { useEffect, useState } from "react"
import personService from "./services/persons"

const Persons = ({ data, removePerson }) => {
  return (
    <div>
      {data.map(person => 
        <p key={person.name}>
          <Person key={person.name} personData={person} /> <button id={person.id} name={person.name} onClick={removePerson}>delete</button>
        </p>
      )}
    </div>
  )
}

const Person = ({ personData }) => {
  return (
    <>{personData.name} {personData.number}</>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with<input value={props.newFilter} onChange={props.handleFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.name} onChange={props.handleNameChange} />
      </div>
      <div>
        number: <input value={props.number} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [showAll] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const filterPerson = persons.filter(person => person.name.toUpperCase().includes(newFilter.toUpperCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if(persons.map(person => person.name).includes(newName)){
      window.alert(`${newName} is already added to the phonebook`)
    } else {
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName("")
          setNewNumber("")
        })
    }  
  }

  const removePerson = (event) => {
    event.preventDefault()
    console.log(event.target)
    if(window.confirm(`Delete ${event.target.name} ?`)){
      personService
        .remove(event.target.id)
        .then(response => {
          setPersons(persons.filter(p => p.id != event.target.id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm 
        name={newName}
        handleNameChange={handleNameChange}
        number={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h3>Numbers</h3>
      <Persons data={filterPerson} removePerson={removePerson} />
    </div>
  )
}

export default App