const express = require('express') //Set up our main function variable for calling the Express module and require it as a dependency
//Call body-parser for POST data handling
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const { sequelize, users, costs } = require('./db');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

//Express needs a port and host for its output. We'll define these here and change them later.
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

console.log(port)

//Set up our PUG templates

app.use(express.static('public'))


app.use("/api", apiRouter);

costs.belongsTo(users, {
  foreignKey: {
    name: 'email'
  }
});


sequelize.sync();

//Output to console via our Express object “app”

app.listen(port, host, () => {
    console.log(`Server started at ${host} port ${port}`);
});
