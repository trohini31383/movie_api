import React from 'react';
import axios from 'axios';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import './main-view.scss';

export class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
      newUser: null
    }
  }


  componentDidMount() {
    axios.get('http://localhost:3000/movies')
      .then(response => {
        this.setState({
          movies: response.data

        });

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(user) {
    this.setState({
      user
    });
  }



  handleButtonClicked = () => {
    this.setState({
      selectedMovie: null
    });
  }

  registerUser() {

    this.setState({

      newUser: true

    });

  }
  userRegistered() {

    this.setState({

      newUser: null

    });

  }


  render() {
    const { user, newUser, selectedMovie, movies } = this.state

    if (newUser) {
      return (
        <RegistrationView userRegistered={() => this.userRegistered()} onLoggedIn={user => this.onLoggedIn(user)} />
      );
    }

    if (!user) return (
      <div>
        <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
        New User? <button
          variant="primary"
          onClick={() => this.registerUser()}>Sign up
        </button>

      </div>
    )



    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {selectedMovie
          ? <MovieView
            movie={selectedMovie}
            goBack={this.handleButtonClicked}
          />
          : movies.map(movie => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onClick={movie => this.onMovieClick(movie)}
            />
          ))
        }
      </div>
    );
  }
}