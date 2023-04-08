// For secure connection to CockroachDB
const fs = require('fs');
const Sequelize = require("sequelize-cockroachdb");

// Connect to CockroachDB through Sequelize
let sequelize = new Sequelize({
    dialect: "postgres",
    username: "mihir",
    password: "B6aQaWo3Z5zQkfZNWPdBOQ",
    host: "muddy-mole-3664.g8z.cockroachlabs.cloud",
    port: 26257,
    database: "defaultdb",
    dialectOptions: {
      ssl: {
        
        //For secure connection:
        ca: fs.readFileSync('./root.crt')
                .toString()
      },
    },
    logging: false, 
  });
  
  const users = sequelize.define("users", {
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    username: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false,
    },
    email: {
        type: Sequelize.TEXT,
        primaryKey: true,
        
    },
    budget: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
  });

  module.exports = {sequelize, users}