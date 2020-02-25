import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './director-view.scss';
import { Link } from "react-router-dom";

/**

 * Director information view

 * @class DirectorView

 * @param {string} props - Movie.Director.Name props

 * @returns {DirectorView}

 */
export class DirectorView extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {

    const { Director } = this.props;

    if (!Director) return null;
    return (
      <Card className="director-info" style={{ width: '18rem' }}>

        <Card.Body>
          <Card.Title className="director-name">{Director.Name}</Card.Title>
          <Card.Text>

            Biography: <br />

            <br />
            {Director.Bio}
            <br />

            <br />

            Birth Year:  {Director.Birth}

          </Card.Text>

          <div >

            <Link to={`/`}>

              <Button className="button-card" variant="info">Back</Button>

            </Link>

          </div>

        </Card.Body>

      </Card>

    );

  }

}



