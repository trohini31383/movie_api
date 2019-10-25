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
  "mongodb+srv://trohini:Aviabhav@tiger9@myflixdb-1vdbn.mongodb.net/myFlixDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cors());
var allowedOrigins = ["http://localhost:1234"];
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
app.post("/users", function(req, res) {
  req.checkBody("Name", "Username is required").notEmpty();

  req
    .checkBody(
      "Name",
      "Username contains non alphanumeric characters - not allowed."
    )
    .isAlphanumeric();

  req.checkBody("Password", "Password is required").notEmpty();

  req.checkBody("Email", "Email is required").notEmpty();

  req.checkBody("Email", "Email does not appear to be valid").isEmail();

  // check the validation object for errors

  var errors = req.validationErrors();

  if (errors) {
    return res.status(422).json({ errors: errors });
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
});
app.put(
  "/users/:Email",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    check("Name", "Username is required").isLength({ min: 5 }),
      check(
        "Name",
        "Username contains non alphanumeric characters - not allowed."
      ).isAlphanumeric(),
      check("Password", "Password is required").notEmpty(),
      check("Email", "Email does not appear to be valid").isEmail();
    var errors = req.validationErrors();

    if (errors) {
      return res.status(422).json({ errors: errors });
    }

    Users.findOneAndUpdate(
      { Email: req.params.Email },
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
  "/users/:Email/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { Email: req.params.Email },
      {
        $addToSet: { Favoritemovies: req.params.MovieID }
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
  "/users/:Email/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndUpdate(
      { Email: req.params.Email },
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
  "/users/:Email",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOneAndRemove({ Email: req.params.Email })

      .then(function(user) {
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
  "/users/:Email",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    Users.findOne({ Email: req.params.Email })
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
