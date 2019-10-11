import React from 'react';
import './movie-view.scss';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';


export class MovieView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { movie } = this.props;

    if (!movie) return null;

    return (
      <div className="movie-view">
        <div className="movie-title">
          <div className="label"><b>Title</b></div>
          <div className="value">{movie.Title}</div>
        </div>

        <div className="movie-description">
          <div className="label"><b>Description</b></div>
          <div className="value">{movie.Description}</div>
        </div>

        <div className="movie-genre">
          <div className="label"><b>Genre</b></div>
          <div className="value">{movie.Genre.Name}</div>
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">Genre</Button>
          </Link>

        </div>

        <div className="movie-director">
          <div className="label"><b>Director</b></div>
          <div className="value">{movie.Director.Name}</div>

          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">Director</Button>
          </Link>
        </div>



        <Link to={`/`}>
          <Button>Go Back</Button>
        </Link>
      </div >
    );
  }
}