// For secure connection to CockroachDB
const { SERVFAIL } = require('dns');
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
  
  const costs = sequelize.define('costs',{
    cost: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    typeofcost: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    location: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    numtimesbought: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
  });

  
const PasswordReset = sequelize.define('passwordReset', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    expiresAt: {
      type: Sequelize.DATE,
      allowNull: false
    }
  });


  module.exports = {sequelize, users, costs, PasswordReset}