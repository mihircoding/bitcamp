const {Router} = require("express");
const {users} = require("../db");

const router = new Router();

//Handle submitted form data
 
// POST calls
router.post('/submit', function (req, res) {
 console.log({body: req.body});
    //Get our values submitted from the form
    var fromName = req.body.name;
    var fromUsername = req.body.uname;
    var fromPassword = req.body.psw;
    var fromEmail = req.body.email;
    var fromBudget = req.body.budget;
  
    //Add our POST data to CockroachDB via Sequelize
    users.sync({
        force: false,
    })
        .then(function () {
        // Insert new data into People table
        return users.bulkCreate([
            {
            name: fromName,
            username: fromUsername,
            email: fromEmail,
            budget: fromBudget,
            password: fromPassword,
            },
        ]);
        })
  
        //Error handling for database errors
        .catch(function (err) {
        console.error("error: " + err.message);
        });    
        
        //Tell them it was a success
        res.send('Submitted Successfully!<br /> Name:  ' + fromName + '<br />Username:  ' + fromUsername);
  });

// GET calls

// HELPER FUNCTIONS

module.exports = router;
