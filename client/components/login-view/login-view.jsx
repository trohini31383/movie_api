import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';

import Container from 'react-bootstrap/Container';
import './login-view.scss';


export function LoginView(props) {
  const [Name, setUsername] = useState('');
  const [Password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(Name, Password);
    /* Send a request to the server for authentication */
    /* then call props.onLoggedIn(username) */

    props.onLoggedIn(Name)
  };

  return (

    <Container className='Login-View'>
      <Form>
        <h1>Login</h1>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label><b>Email address</b></Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={Name}
            onChange={e => {
              setUsername(e.target.value)
            }}
          />
          <Form.Text
            className='text-muted'>We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId='formBasicPassword'>
          <Form.Label><b>Password</b></Form.Label>
          <Form.Control
            value={Password}
            onChange={e => setPassword(e.target.value)}
            type='password'
            placeholder='Password'
          />
        </Form.Group>

        <Button className='btn' variant='Primary' onClick={handleSubmit}>Submit</Button>

      </Form>
    </Container>
  );
}

LoginView.propTypes = {

  Name: PropTypes.string.isRequired,

  Password: PropTypes.string.isRequired,

  onClick: PropTypes.func.isRequired,

  onLoggedIn: PropTypes.func.isRequired

};

