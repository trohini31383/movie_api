import React from 'react';

import axios from 'axios';



import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';

import ListGroup from 'react-bootstrap/ListGroup';

import './profile-view.scss'





import { Link } from "react-router-dom";



export class ProfileView extends React.Component {



  constructor() {

    super();

    this.state = {

      Name: null,

      Password: null,

      Email: null,

      Birthday: null,

      userData: null,

      Favoritemovies: []

    };

  }



  componentDidMount() {



    let accessToken = localStorage.getItem('token');

    if (accessToken !== null) {

      this.getUser(accessToken);

    }

  }



  getUser(token) {

    let Email = localStorage.getItem('user');

    axios.get(`https://all-about-movies.herokuapp.com/users/${Email}`, {

      headers: { Authorization: `Bearer ${token}` }

    })

      .then(response => {
        console.log(response)
        this.setState({
          userData: response.data,
          Name: response.data.Name,
          Password: response.data.Password,
          Email: response.data.Email,
          Birthday: response.data.Birthday,
          Favoritemovies: response.data.Favoritemovies
        });
      })
      .catch(function (error) {
        console.log(error);
      });

  }
  deletefromFavs(event, Favoritemovie) {
    event.preventDefault();
    axios.delete(`https://all-about-movies.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${Favoritemovie}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        this.getUser(localStorage.getItem('token'));
      })
      .catch(event => {
        alert('Oops... something went wrong...');
      });
  }

  handleChange(e) {

    this.setState({ [e.target.Email]: e.target.value })

  }

  render() {
    const { Name, Email, Birthday, Favoritemovies } = this.state;



    return (

      <Card className="profile-view" style={{ width: '32rem' }}>



        <Card.Body>

          <Card.Title className="profile-title">My Profile</Card.Title>

          <ListGroup>

            <ListGroup.Item>Username: {Name}</ListGroup.Item>

            <ListGroup.Item>Password:******* </ListGroup.Item>

            <ListGroup.Item>Email: {Email}</ListGroup.Item>

            <ListGroup.Item>Birthday: {Birthday}</ListGroup.Item>

            <ListGroup.Item>Favourite Movies:

             <div>

                {Favoritemovies.length === 0 &&

                  <div className="value">No Favourite Movies have been added</div>

                }

                {Favoritemovies.length > 0 &&

                  <ul>

                    {Favoritemovies.map(Favoritemovie =>

                      (<li key={Favoritemovie}>

                        <p className="Favoritemovies">
                          {JSON.parse(localStorage.getItem('movies')).find(movie => movie._id === Favoritemovie).Title}

                        </p>

                        <Link to={`/movies/${Favoritemovie}`}>

                          <Button variant="info">Open</Button>

                        </Link>
                        <Button variant="secondary" onClick={(event) => this.deletefromFavs(event, Favoritemovie)}>

                          Delete

                        </Button>



                      </li>)

                    )}

                  </ul>

                }

              </div>

            </ListGroup.Item>

          </ListGroup>

          <div >

            <Link to={`/`}>

              <Button>MOVIES</Button>

            </Link>
            <Link to={`/update/:Email`}>

              <Button className="button-update" variant="outline-secondary">Update profile</Button>

            </Link>


          </div>

        </Card.Body>

      </Card>

    );

  }

}