import React from "react"

const Header = ({ course }) => {
    return (
      <h2>{course.name}</h2>
    )
}
  
const Total = ({ course }) => {
    const sum = course.parts.reduce((x, y) => x + y.exercises, 0)
    return (
      <p><b>total of {sum} exercises</b></p>
    )
}
  
const Part = ({ course }) => {
    return (
      <p>
        {course.name} {course.exercises}
      </p>
    )
}
  
const Content = ({ course }) => {
    return (
      <>
        {course.parts.map(part => <Part key={part.id} course={part} />)}
      </>
    )
}
  
const Course = (props) => {
    return (
      <div>
        <Header course={props.course} />
        <Content course={props.course} />
        <Total course={props.course} />
      </div>
    )
}

export default Course