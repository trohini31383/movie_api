const express = require("express"),
  morgan = require("morgan");
const app = express();
let topmovies = [
  {
    title: "Jurassic Park",
    director: {
      name: "Steven Spielberg",
      bio: "American",
      dob: "Dec 18, 1946"
    },
    genre: "action , sci-fi"
  },
  {
    title: "Spiderman",
    director: {
      name: "Sam Raimi",
      bio: "American",
      dob: "oct 23,1959"
    },
    genre: "action , drama"
  },
  {
    title: "martian",
    director: {
      name: "Ridley Scott",
      bio: "English",
      dob: "Nov 30, 1937"
    },
    genre: "action , sci-fi"
  },
  {
    title: "Independence Day",
    director: {
      name: "Roland Emmerich",
      bio: "German",
      dob: "Nov 10, 1955"
    },
    genre: "action , sci-fi"
  },
  {
    title: "Titanic",
    director: {
      name: "James Cameron",
      bio: "Canadian",
      dob: "Aug 16, 1954"
    },
    genre: "romance"
  },
  {
    title: "Home Alone",
    director: {
      name: "Chris Columbus",
      bio: "American",
      dob: "sep 10,1958"
    },
    genre: "comedy"
  },
  {
    title: "Harry Potter",
    director: {
      name: "Chris Columbus",
      bio: "American",
      dob: "sep 10,1958"
    },
    genre: "sci-fi"
  },
  {
    title: "3 Idiots",
    director: {
      name: "Rajkumar Hirani",
      bio: "Indian",
      dob: "Nov22, 1962"
    },
    genre: "comedy"
  },
  {
    title: "Avengers Endgame",
    director: {
      name: "Joe Russo",
      bio: "American",
      dob: "1971"
    },
    genre: "action , sci-fi"
  },
  {
    title: "Baby's Day Out",
    director: {
      name: "Patrick Read Johnson",
      bio: "American",
      dob: "May 07, 1962"
    },

    genre: "comedy"
  }
];
app.use(morgan("common"));
app.get("/", function(req, res) {
  res.send("Welcome to my movie club!");
});
app.get("/movies/:title/genre", function(req, res) {
  res.send("get the movie genre by movie's title");
});
app.get("/movies/:title/director/:name", function(req, res) {
  res.send("get the movie director's name by movie's title");
});
app.post("/users", function(req, res) {
  res.send("Add a new user");
});
app.post("/users/:username", function(req, res) {
  res.send("New user information is updated");
});
app.put("/favorites/:username/movies/:title", function(req, res) {
  res.send("Add a movie to the user's favorite list");
});

app.delete("/favorites/:username/movies/:title", function(req, res) {
  res.send("Delete a movie from the user's favorite list");
});

app.delete("/users/:username", function(req, res) {
  res.send("User is deleted");
});

app.get("/movies", function(req, res) {
  res.json(topmovies);
});
app.get("/movies/:title", (req, res) => {
  res.json(
    topmovies.find(movie => {
      return movie.title === req.params.title;
    })
  );
  //res.send("get data about a single movie");
});
app.use(express.static("public"));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(8080, () => console.log("Your app is listening on port 8080."));
