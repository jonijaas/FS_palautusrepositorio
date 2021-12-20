import React from "react"
import Person from "./Person"

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

export default Persons