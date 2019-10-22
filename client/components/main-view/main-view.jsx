import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import { ProfileUpdate } from '../profile-view/profile-update';
import Button from 'react-bootstrap/Button';
import './main-view.scss';

export class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      user: null,
      userInfo: {}

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
    axios.get('https://all-about-movies.herokuapp.com/movies', {
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
  getUser(token) {

    axios

      .get('https://all-about-movies.herokuapp.com/users', {

        headers: { Authorization: `Bearer ${token}` }

      })

      .then(response => {

        this.props.setLoggedUser(response.data);

      })

      .catch(error => {

        console.log(error);

      });

  }





  onLogout() {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    window.open('/', '_self');
  }





  render() {
    const { movies, user, token, userInfo } = this.state


    if (!movies) return <div className="main-view" />;

    return (
      <Router>

        <Route exact path="/" render={() => {
          if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
          return movies.map(m => <MovieCard key={m._id} movie={m} />)
        }
        } />
        <Route path="/register" render={() => <RegistrationView />} />
        <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />
        <Route path="/directors/:Name" render={({ match }) => {
          if (!movies) return <div className="main-view" />;
          return <DirectorView Director={movies.find(m => m.Director.Name === match.params.Name).Director} />
        }
        } />
        <Route path="/genres/:Name" render={({ match }) => {
          if (!movies) return <div className="main-view" />;
          return <GenreView Genre={movies.find(m => m.Genre.Name === match.params.Name).Genre} />
        }
        } />
        <Route path="/users/:Email" render={({ match }) => { return <ProfileView userInfo={userInfo} /> }} />
        <Route path="/update/:Email" render={() => <ProfileUpdate userInfo={userInfo} user={user} token={token} updateUser={data => this.updateUser(data)} />}

        />
        <div>
          <Link to={`/users/${user}`}>
            <Button variant="info">Profile</Button>
          </Link><p></p>

          <Button onClick={() => this.onLogout()}><b>Log out</b></Button>
        </div>


      </Router >



    );
  }
}