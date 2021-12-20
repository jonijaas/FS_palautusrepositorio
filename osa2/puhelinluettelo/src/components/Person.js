import React from "react"

const Person = ({ personData }) => {
    return (
      <>{personData.name} {personData.number}</>
    )
}

export default Person