import React from 'react';
import axios from 'axios';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: null,
      selectedMovie: null
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

  handleButtonClicked = () => {
    this.setState({
      selectedMovie: null
    });
  }


  render() {

    const { movies, selectedMovie } = this.state;


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