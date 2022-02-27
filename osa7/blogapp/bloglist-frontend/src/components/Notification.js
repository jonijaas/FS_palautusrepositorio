import React from 'react'
import { Alert } from 'react-bootstrap'

const Notification = ({ message, style }) => {
  if (message === null) {
    return null
  } else if (style === 'notification') {
    return <Alert variant="success">{message}</Alert>
  } else {
    return <Alert variant="danger">{message}</Alert>
  }
}

export default Notification
