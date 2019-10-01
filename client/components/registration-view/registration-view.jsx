import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';

import Container from 'react-bootstrap/Container';

import './registration-view.scss';
export function RegistrationView(props) {

  const [Name, setUsername] = useState('');

  const [Password, setPassword] = useState('');

  const [Email, setEmail] = useState('');

  const [Birthday, setBirthday] = useState('');



  const successfulRegistration = (e) => {

    e.preventDefault();

    props.userRegistered();

    props.onLoggedIn(Name);

  };
  return (

    <Container className='registration-view'>

      <h1>Register</h1>

      <Form>

        <Form.Group controlId='formNewUsername'>

          <Form.Label>Username:</Form.Label>

          <Form.Control type='text' placeholder='Your username' value={Name} onChange={e => setUsername(e.target.value)} />

        </Form.Group>

        <Form.Group controlId='formNewPassword'>

          <Form.Label>Password</Form.Label>

          <Form.Control type='password' placeholder='Your password' value={Password} onChange={e => setPassword(e.target.value)} />

        </Form.Group>

        <Form.Group controlId='formNewEmail'>

          <Form.Label>Email</Form.Label>

          <Form.Control type='email' placeholder='your@email.com' value={Email} onChange={e => setEmail(e.target.value)} />

        </Form.Group>

        <Form.Group controlId='formNewBirthday'>

          <Form.Label>Birthday</Form.Label>

          <Form.Control type='date' placeholder='MM/DD/YYYY' value={Birthday} onChange={e => setBirthday(e.target.value)} />

        </Form.Group>

        <Button variant='primary' onClick={successfulRegistration}>Register</Button>
      </Form>

    </Container>

  ); // return

}
RegistrationView.propTypes = {

  Name: PropTypes.string.isRequired,

  Password: PropTypes.string.isRequired,

  Email: PropTypes.string.isRequired,

  Birthday: PropTypes.string.isRequired,

  onClick: PropTypes.func.isRequired,

  userRegistered: PropTypes.func.isRequired,

  onLoggedIn: PropTypes.func.isRequired

}