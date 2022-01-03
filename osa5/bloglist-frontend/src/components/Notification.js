import React from 'react'

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  }
  console.log(style)
  return (
    <div className={style}>
      {message}
    </div>
  )
}

export default Notification
