import React, { useState, useEffect } from 'react';

import axios from 'axios';

import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';

import './profile-view.scss'
import Container from 'react-bootstrap/Container';
export function ProfileUpdate(props) {

  const [Name, setName] = useState('');

  const [Email, setEmail] = useState('');

  const [Password, setPassword] = useState('');

  const [loaded, setLoaded] = useState(false)


  const user = props.user;

  useEffect(() => {
    axios.get(`https://all-about-movies.herokuapp.com/users/${user}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      .then((user) => {
        setName(user.data.Name)
        setEmail(user.data.Email)
        setLoaded(true)
      })
  }, [])


  const handleUpdate = (e) => {
    e.preventDefault();
    const userInfo = {
      Name: Name,
      Password: Password,
      Email: Email
    };

    if (Password === '') {
      delete userInfo.Password
    }
    axios
      .put(`https://all-about-movies.herokuapp.com/users/${user}`,
        userInfo,

        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      )
      .then(response => {
        props.updateUser(userInfo);
        alert('Your profile was updated successfully');
      })
      .catch(e => {
        const errors = e.response.data.errors || [];
        let errorMessage = '';
        errors.forEach(err => {
          errorMessage += err.msg;
        });

        alert(`Oops there was an error ${errorMessage}`)
        console.log('error updating profile');
      });
  }



  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(`https://all-about-movies.herokuapp.com/users/${user}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        alert('Your account has been deleted');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.open('/', '_self');
      })
      .catch(e => {
        alert('Error deleting the account');
      });

  }

  if (!loaded) {
    return (<div>Loading...</div>)
  }
  return (

    <Container>
      <Form className="update-form">
        <div className="text-center">
          <p className="update-title">Please update your information below:</p>
        </div>

        <Form.Group controlId="formNewUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Your username" value={Name} onChange={e => setName(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="formPassword">

          <Form.Label>Password</Form.Label>

          <Form.Control type="password" placeholder="Your Password" value={Password} onChange={e => setPassword(e.target.value)} />

        </Form.Group>

        <Form.Group controlId="formBasicEmail">

          <Form.Label>Email address</Form.Label>

          <Form.Control type="email" placeholder="Enter email" value={Email} onChange={e => setEmail(e.target.value)} />

          <Form.Text className="text-muted">

            We'll never share your email with anyone else.

          </Form.Text>

        </Form.Group>

        <div className="text-center">

          <Button className="btn-register" variant="secondary" type="submit" onClick={handleUpdate} >

            Update

      </Button>

          <Button className="btn-delete" variant="danger" type="submit" onClick={handleDelete} >

            Delete profile

      </Button>

        </div>

      </Form>
    </Container>

  );

}