import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import Button from 'react-bootstrap/Button';
import './main-view.scss';

export class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      user: null,
    };
  }




  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }


  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Email
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Email);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios.get('http://localhost:3000/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }




  onLogout() {
    localStorage.removeItem('token');

    localStorage.removeItem('user');
    window.open('/', '_self');
  }





  render() {
    const { user, token } = this.state
    let { movies } = this.props;

    if (!movies) return <div className="main-view" />;

    return (
      <Router>
        <div>
          <Link to={`/users/${user}`}>
            <Button variant="info">Profile</Button>
          </Link>
          <Button onClick={() => this.onLogout()}><b>Log out</b></Button>
        </div>
        <Route exact path="/" render={() => {
          if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
          return movies.map(m => <MovieCard key={m._id} movie={m} />)
        }
        } />
        <Route path="/register" render={() => <RegistrationView />} />
        <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
        <Route path="/directors/:Name" render={({ match }) => {
          if (!movies) return <div className="main-view" />;
          return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
        }
        } />
        <Route path="/genre/:Name" render={({ match }) => {
          if (!movies) return <div className="main-view" />;
          return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
        }
        } />

      </Router >


    );
  }
}