import React, { useEffect, useState } from "react"
import personService from "./services/personService"
import Notification from "./components/Notification"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import PersonForm from "./components/PersonForm"


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState("successful")

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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
      if(window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        editPerson(personObject)
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNumber("")
          setStyle("successful")
          setMessage(
            `Added ${newName} `
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setStyle("error")
          setMessage(error.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }  
  }

  const removePerson = (event) => {
    event.preventDefault()
    if(window.confirm(`Delete ${event.target.name} ?`)){
      personService
        .remove(event.target.id)
        .then(returnedPerson => {
          setPersons(persons.filter(p => p.id != event.target.id))
          setStyle("successful")
          setMessage(
            `Removed ${event.target.name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch( error => {
          setStyle("error")
          setMessage(
            `Information of ${event.target.name} has already been removed from server`
          )
          console.log(error)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id != event.target.id))
        })
    }
  }

  const editPerson = (personObject) => {
    const editPerson = persons.find(p => p.name === personObject.name)
    const editedPerson = { ...editPerson, number: personObject.number}

    personService
      .update(editPerson.id, editedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== editPerson.id ? p : returnedPerson))
        setNewName("")
        setNewNumber("")
        setStyle("successful")
        setMessage(
          `${personObject.name}'s number changed`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch( error => {
        setStyle("error")
        setMessage(
          `Information of ${personObject.name} has already been removed from server`
        )
        console.log(error)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== editPerson.id))
      })
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
      <Notification message={message} style={style}/>
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