const path = require("path");
const mongoose = require("mongoose");
const Models = require("./models.js");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const { check, validationResult } = require("express-validator");
require("./passport");
const app = express();
const cors = require("cors");
const Movies = Models.Movie;
const Users = Models.User;
/*mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true
});*/
mongoose.connect(
  "mongodb+srv://trohini:Aviabhav@tiger9@myFlixDB-1vdbn.mongodb.net/myFlixDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cors());
var allowedOrigins = ["http://localhost:1234"];
var auth = require("./auth")(app);
app.get("/", function (req, res) {
  res.send("Welcome to my movie club!");
});

/**

*endpoint 1 returns a list of all movies

*endpoint URL: /movies

*GET request

*no required params

*example request:

*@function getMovies(token) {

*  axios

*    .get("https://all-about-movies.herokuapp.com/movies", {

*      headers: { Authorization: `Bearer ${token}` }

*    })

*    .then(response => {

*      this.props.setMovies(response.data);

*    })

*    .catch(function(error) {

*      console.log(error);

*    });

*}

*example response:



*@param {string} _id

*@param {string}title

*@param {string}description

*@param {object} director

*@param {object} genre

*/

app.get("/movies", passport.authenticate("jwt", { session: false }), function (
  req,
  res
) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get(
  "/movies/genre/:Title",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Movies.findOne({ Title: req.params.Title })

      .then(function (movie) {
        if (movie) {
          res
            .status(201)
            .send(
              "Movie with the title : " +
              movie.Title +
              " is  a " +
              movie.Genre.Name +
              " movie ."
            );
        } else {
          res
            .status(404)
            .send(
              "Movie with the title : " + req.params.Title + " was not found."
            );
        }
      })

      .catch(function (err) {
        console.error(err);

        res.status(500).send("Error:" + err);
      });
  }
);
app.get(
  "/movies/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Movies.findOne({ "Director.Name": req.params.Name })

      .then(function (movies) {
        res.json(movies.Director);
      })

      .catch(function (err) {
        console.error(err);

        res.status(500).send("Error:" + err);
      });
  }
);
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Movies.findOne({ Title: req.params.Title })

      .then(function (movies) {
        res.json(movies);
      })

      .catch(function (err) {
        console.error(err);

        res.status(500).send("Error:" + err);
      });
  }
);

/**

*endpoint 5 allow users to register

*endpoint URL: /users

*POST request

*params required:

*@params {string} Name

*@params {string} Password

*@params {string} Email

*@params {date} Birthday

*@constant handleSubmit

*example request:

*@function handleSubmit = (e) => {

*  e.preventDefault();

*  axios.post('https://aii-about-movies.herokuapp.com/users', {

*      Name: Name,

*      Email: Email,

*      Birthday: Birthday,

*      Password: Password

      

*  })

*  .then(response =>{

*    const data = response.data;

*    console.log(data);

*    window.location.assign('/');

*  })

*  .catch(e => {

*    console.log('error registering the user')

*  });

*}

*example response:

*@param {object} user

*@params {string} Name

*@params {string} Password

*@params {string} Email

*@params {date} Birthday

*/
app.post(
  "/users",
  [
    check("Name", "Username is required").isLength({ min: 5 }),
    check(
      "Name",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required")
      .not()
      .isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail()
  ],
  (req, res) => {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Name: req.body.Name })
      .then(function (user) {
        if (user) {
          return res.status(400).send(req.body.Name + "already exists");
        } else {
          Users.create({
            Name: req.body.Name,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(function (user) {
              res.status(201).json(user);
            })
            .catch(function (error) {
              console.error(error);
              res.status(500).send("Error:" + error);
            });
        }
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).send("Error:" + error);
      });
  }
);

/**

*endpoint 6 allow users to update information

*endpoint URL: /users/:Email

*PUT request

*@params {string} Name

*@params {string} Password

*@params {string} Email

*@params {date} Birthday

*example request:

*@function handleUpdate(token) {

*  const { user } = this.props;

*  const { Name, Email, Birthday, Password } = this.state;

*  axios({

*    method: "put",

*    url: `https://all-about-movies.herokuapp.com/users/${user.Email}`,

*    headers: {

*      Authorization: `Bearer ${token}`

*    },

*    data: {

*      Name: Name,

*      Email: Email,

*      Birthday: Birthday,

*      Password: Password

*      

*    }

*  })

*    .then(response => {

*      //const data = response.data;

*      localStorage.removeItem("token");

*      localStorage.removeItem("user");

*      window.location.reload();

*    })

*    .catch(e => {

*      console.log("error updating the user");

*    });

*}

*example response:

*@param {object} user

*@params {string} Name

*@params {string} Password

*@params {string} Email

*@params {date} Birthday

*/


app.put(
  "/users/:Email",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    Users.findOneAndUpdate(
      { Email: req.params.Email },
      {
        $set: { ...req.body }
      },

      { new: true },
      function (err, updatedUser) {
        if (err) {
          console.error(err);

          res.status(500).send("Error:" + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**

*endpoint 7 add a movie to users favorites

*endpoint URL: /users/:Email/Movies/:MovieID

*POST request

*@params {ObjectId} _id

*@params {string} user

*@function addToFavs() {

*  const { movie} = this.props;

*  const user = localStorage.getItem("user");

*  const token = localStorage.getItem("token");

*  console.log({ token });

*  axios

*    .post(

*      `https://all-about-movies.com/users/${user}/Movies/${

*        movie._id

*      }`,

*      null,

*      { headers: { Authorization: `Bearer ${token}` } }

*    )

*    .then(res => {

*      console.log(res);

*      window.location.reload();

*    })

*    .catch(error => {

*      console.log(error);

*    });

*}

*example response:

* Json of users updated list of favorites

*/
app.post(
  "/users/:Email/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { Email: req.params.Email },
      {
        $addToSet: { Favoritemovies: req.params.MovieID }
      },
      { new: true },
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**

*endpoint 8 delete a movie from users list of favorites

*endpoint URL: /users/:Email/Movies/:MovieID

*DELETE request

*@params {ObjectId} _id

*@params {string} user

*example request:

deletefromFavs(id, token) {

  const { favorites } = this.props;

  const { user } = this.props;

  axios.delete(

    `https://all-about-movies.com/users/${user.Email}/Movies/${id}`,

    {

      headers: { Authorization: `Bearer ${token}` }

    })

    .then(res => {

      console.log(res);

      window.location.reload();

    })

    .catch(error => {

      console.log(error);

    });

}

*example response:

* Json of users updated list of favorites

*/

app.delete(
  "/users/:Email/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOneAndUpdate(
      { Email: req.params.Email },
      {
        $pull: { Favoritemovies: req.params.MovieID }
      },

      { new: true },

      function (err, updatedUser) {
        if (err) {
          console.error(err);

          res.status(500).send("Error:" + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

/**

*endpoint 9 delete a user

*endpoint URL: /users/:Email

*DELETE request

*@params {string} user

*example request:

*@function handleDelete(token) {

*  const { user } = this.props;

*  axios

*    .delete(`https://all-about-movies.herokuapp.com/users/${user.Email}`, {

*      headers: { Authorization: `Bearer ${token}` }

*    })

*    .then(res => {

*      localStorage.removeItem("token");

*      localStorage.removeItem("user");

*      window.location.reload();

*    })

*    .catch(error => {

*      console.log(error);

*    });

*}

*example response:

* user is deleted

*/
app.delete(
  "/users/:Email",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOneAndRemove({ Email: req.params.Email })

      .then(function (user) {
        if (!user) {
          res
            .status(400)
            .send(
              "Account with the Email: " + req.params.Email + " was not found ."
            );
        } else {
          res
            .status(200)
            .send(
              "Account with the Email : " +
              req.params.Email +
              " was successfully deleted."
            );
        }
      })

      .catch(function (err) {
        console.error(err.stack);

        res.status(500).send("Error: " + err);
      });
  }
);
app.get("/users", passport.authenticate("jwt", { session: false }), function (
  req,
  res
) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get(
  "/users/:Email",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOne({ Email: req.params.Email })
      .then(function (user) {
        res.json(user);
      })
      .catch(function (err) {
        console.error(err);

        res.status(500).send("Error:" + err);
      });
  }
);
/*app.use(express.static("public"));
app.use('/client', express.static(path.join(__dirname, 'client/dist')));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});*/
app.use(express.static("public"));
app.use("/client", express.static(path.join(__dirname, "client", "dist")));
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 3000");
});
