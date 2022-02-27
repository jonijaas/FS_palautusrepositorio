import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, FloatingLabel } from 'react-bootstrap'

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <FloatingLabel
            label="Username"
            controlId="floatingInput"
            className="mb-3"
          >
            <Form.Control
              id="username"
              placeholder="Username"
              type="text"
              value={username}
              name="Username"
              onChange={handleUsernameChange}
              style={{ width: '50%' }}
            />
          </FloatingLabel>
          <FloatingLabel
            label="Password"
            controlId="floatingPassword"
            className="mb-3"
          >
            <Form.Control
              id="password"
              placeholder="password"
              type="password"
              value={password}
              name="Password"
              onChange={handlePasswordChange}
              style={{ width: '50%' }}
            />
          </FloatingLabel>
        </Form.Group>
        <Button variant="primary" id="login-button" type="submit">
          login
        </Button>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
}

export default LoginForm
