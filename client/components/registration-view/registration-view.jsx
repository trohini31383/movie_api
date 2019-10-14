import React, { useState } from 'react';
import axios from 'axios';

import PropTypes from 'prop-types';
import { LoginView } from '../login-view/login-view';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';
//import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';

import './registration-view.scss';
export function RegistrationView(props) {

  const [Name, setName] = useState('');

  const [Password, setPassword] = useState('');

  const [Email, setEmail] = useState('');

  const [Birthday, setBirthday] = useState('');



  const successfulRegistration = (e) => {

    e.preventDefault();

    axios.post('http://localhost:3000/users', {

      Name: Name,

      Password: Password,

      Email: Email,

      Birthday: Birthday

    })

      .then(response => {

        const data = response.data;

        console.log(data);

        window.open('/', '_self');

      })

      .catch(e => {

        console.log('error registering the user')

      });
  };
  return (



    <Container className="registration-view">
      <Form>
        <h1>Register</h1>


        <Form.Group controlId='formNewUsername'>

          <Form.Label>Username:</Form.Label>

          <Form.Control type='text' placeholder='Your username' value={Name} onChange={e => setName(e.target.value)} />

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
        <Form.Group controlId='formNewUser'>

          <Form.Text>Already registered? Click <Link to={`/`}>
            <Button>here</Button>
          </Link> to login</Form.Text>

        </Form.Group>
      </Form>
    </Container>



  );

}
