const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Featured: Boolean,
  imageURL: String
});

var userSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  Favoritemovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }]
});
userSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

var Movie = mongoose.model("Movie", movieSchema);
var User = mongoose.model("User", userSchema);

module.exports.Movie = Movie;

module.exports.User = User;
