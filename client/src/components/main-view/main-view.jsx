import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { setMovies, setLoggedUser } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
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
      this.getUser(accessToken);
    }
  }

  onMovieClick(movie) {

    window.location.hash = '#' + movie._id;

    this.setState({

      selectedMovieId: movie._id

    });

  }


  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Email
    });
    this.props.setLoggedUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Email);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios.get('https://all-about-movies.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
        localStorage.setItem('movies', JSON.stringify(response.data));
        //this.setState({
        // movies: response.data
        //});
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
    localStorage.removeItem('movies');
    this.setState({

      user: null

    })

    window.open('/client', '_self');


  }





  render() {
    const { user, token, userInfo } = this.state
    let { movies } = this.props;


    if (!movies) return <div className="main-view" />;

    return (
      <Router basename="/client">

        <Route exact path="/" render={() => {
          if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
          return <MoviesList movies={movies} />;
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

let mapStateToProps = state => {

  return {

    movies: state.movies,

    setLoggedUser: state.setLoggedUser

  }

}



export default connect(mapStateToProps, { setMovies, setLoggedUser })(MainView);