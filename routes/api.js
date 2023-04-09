const {Router} = require("express");
const {User} = require("../db");

const router = new Router();

//Handle submitted form data
 
router.post('/submit', function (req, res) {
 
    //Get our values submitted from the form
    var fromName = req.body.name;
    var fromUsername = req.body.username;
    var fromPassword = req.body.password;
  
    //Add our POST data to CockroachDB via Sequelize
    Users.sync({
        force: false,
    })
        .then(function () {
        // Insert new data into People table
        return Users.bulkCreate([
            {
            name: fromName,
            username: fromUsername,
            password: fromPassword,
            },
        ]);
        })
  
        //Error handling for database errors
        .catch(function (err) {
        console.error("error: " + err.message);
        });    
        
        //Tell them it was a success
        res.send('Submitted Successfully!<br /> Name:  ' + fromName + '<br />Phone:  ' + fromPhone);
  });
  
module.exports = router;
