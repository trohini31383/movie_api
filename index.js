const express = require("express"),
  morgan = require("morgan");
const app = express();
let topmovies = [
  {
    title: "Jurassic Park",
    director: "Steven Spielberg"
  },
  {
    title: "Spiderman",
    director: "Sam Raimi"
  },
  {
    title: "martian",
    director: "Ridley Scott"
  },
  {
    title: "Independence Day",
    director: "Roland Emmerich"
  },
  {
    title: "Titanic",
    director: "James Cameron"
  },
  {
    title: "Home Alone",
    director: "Chris Columbus"
  },
  {
    title: "Harry Potter",
    director: "Chris Columbus"
  },
  {
    title: "3 Idiots",
    director: "Rajkumar Hirani"
  },
  {
    title: "Avengers Endgame",
    director: "Joe Russo"
  },
  {
    title: "Baby's Day Out",
    director: "Patrick Read Johnson"
  }
];
app.use(morgan("common"));
app.get("/", function(req, res) {
  res.send("Welcome to my movie club!");
});
app.get("/movies", function(req, res) {
  res.json(topmovies);
});
app.use(express.static("public"));
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(8080, () => console.log("Your app is listening on port 8080."));
