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
//mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//useNewUrlParser: true
//});
mongoose.connect(
  "mongodb+srv://trohini:Aviabhav@tiger9@myflixdb-1vdbn.mongodb.net/myFlixDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cors());
var auth = require("./auth")(app);
app.get("/", function(req, res) {
  res.send("Welcome to my movie club!");
});

app.get("/movies", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  Movies.find()
    .then(function(movies) {
      res.status(201).json(movies);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get(
  "/movies/genre/:Title",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Movies.findOne({ Title: req.params.Title })

      .then(function(movie) {
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

      .catch(function(err) {
        console.error(err);

        res.status(500).send("Error:" + err);
      });
  }
);
app.get(
  "/movies/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Movies.findOne({ "Director.Name": req.params.Name })

      .then(function(movies) {
        res.json(movies.Director);
      })

      .catch(function(err) {
        console.error(err);

        res.status(500).send("Error:" + err);
      });
  }
);
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Movies.findOne({ Title: req.params.Title })

      .then(function(movies) {
        res.json(movies);
      })

      .catch(function(err) {
        console.error(err);

        res.status(500).send("Error:" + err);
      });
  }
);
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
      .then(function(user) {
        if (user) {
          return res.status(400).send(req.body.Name + "already exists");
        } else {
          Users.create({
            Name: req.body.Name,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(function(user) {
              res.status(201).json(user);
            })
            .catch(function(error) {
              console.error(error);
              res.status(500).send("Error:" + error);
            });
        }
      })
      .catch(function(error) {
        console.error(error);
        res.status(500).send("Error:" + error);
      });
  }
);
app.put(
  "/users/:Name",
  passport.authenticate("jwt", { session: false }),
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

    Users.findOneAndUpdate(
      { Name: req.params.Name },
      {
        $set: {
          Name: req.body.Name,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },

      { new: true },
      function(err, updatedUser) {
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
app.post(
  "/users/:Name/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      {
        $push: { Favoritemovies: req.params.MovieID }
      },
      { new: true },
      function(err, updatedUser) {
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

app.delete(
  "/users/:Name/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { Name: req.params.Name },
      {
        $pull: { Favoritemovies: req.params.MovieID }
      },

      { new: true },

      function(err, updatedUser) {
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
app.delete(
  "/users/:Name",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndRemove({ Name: req.params.Name })

      .then(function(user) {
        if (!user) {
          res
            .status(400)
            .send(
              "Account with the name: " + req.params.Name + " was not found ."
            );
        } else {
          res
            .status(200)
            .send(
              "Account with the username : " +
                req.params.Name +
                " was successfully deleted."
            );
        }
      })

      .catch(function(err) {
        console.error(err.stack);

        res.status(500).send("Error: " + err);
      });
  }
);
app.get("/users", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  Users.find()
    .then(function(users) {
      res.status(201).json(users);
    })
    .catch(function(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.get(
  "/users/:Name",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOne({ Name: req.params.Name })
      .then(function(user) {
        res.json(user);
      })
      .catch(function(err) {
        console.error(err);

        res.status(500).send("Error:" + err);
      });
  }
);
app.use(express.static("public"));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
  console.log("Listening on Port 3000");
});
