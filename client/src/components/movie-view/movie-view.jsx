import React from 'react';
import './movie-view.scss';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from 'axios';



export class MovieView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addtoFavs = () => {
    axios.post(`https://all-about-movies.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${this.props.movie._id}`, {

      Email: localStorage.getItem('user')

    }, {

      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }

    })

      .then(response => {

        console.log(response);

        alert('Movie has been added to your Favorite List!');

      })

      .catch(event => {

        console.log('error adding movie to list');

        alert('Ooooops... Something went wrong!');

      });

  };

  render() {
    const { movie } = this.props;

    if (!movie) return null;


    return (
      <div className="movie-view">
        <img className="movie-poster" src={movie.imageURL} /></div>
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
            <Button variant="link">More</Button>
          </Link>

        </div>

        <div className="movie-director">
          <div className="label"><b>Director</b></div>
          <div className="value">{movie.Director.Name}</div>

          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">More</Button>
          </Link>
        </div>
        <div>

          <Button variant='primary' onClick={this.addtoFavs}>Add to your Favourites</Button>
        </div>



        <Link to={`/`}>
          <Button>Go Back</Button>
        </Link>
      </div >
    );
  }
}