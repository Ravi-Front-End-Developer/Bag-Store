const mongoose = require("mongoose");
const config = require("config"); // I installed the package "npm i config" to import the config file

const debug = require("debug")("development:mongoose-connection");
// app:mongoose-connection is the name of the debug, we can use any name instead of app and mongoose-connection
// basically this is way to tell (status like development, production : from which file the debug is coming)

mongoose
  .connect(config.get("MONGODB_URL"))
  .then(() => {
    console.log("Connected to MongoDB");
    // debug("Connected to MongoDB");
    // In Mac, to use debug we need to run the command "export DEBUG=development:*" or to stop the debug we need to run the command "export DEBUG="
    // In Windows, to use debug we need to run the command "set DEBUG=development:*" or to stop the debug we need to run the command "set DEBUG="
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose.connection;
