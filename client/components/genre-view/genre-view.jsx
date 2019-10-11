import React from 'react';
import Button from 'react-bootstrap/Button';
import './genre-view.scss';
import { Link } from "react-router-dom";
export class GenreView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { Genre } = this.props;
    if (!Genre) return null;
    return (
      <div className="movie-genre">
        <div className="label"><b>Genre</b></div>
        <div className="value">Genre.Name}</div>
        <div className="label"><b>Description</b></div>
        <div className="value">{Genre.Description}</div>
        <Link to={`/`} >
          <Button >Back</Button>
        </Link>
      </div>
    );

  }
}


