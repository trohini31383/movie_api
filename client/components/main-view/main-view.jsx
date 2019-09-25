import React from 'react';
import axios from 'axios';
import { MovieCard } from '../movie-card/movie-card';
export class MainView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: undefined
    }
  }


  componentDidMount() {
    axios.get('<localhost:3000/movies>')
      .then(response => {
        this.setState({
          movies: response.data

        });

      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {

    const { movies } = this.state;


    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {movies.map(movie => (
          <div className="movie-card" key={movie._id}>{movie.Title}</div>
        ))}
      </div>
    );
  }
}