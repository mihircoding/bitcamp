const {Router} = require("express");
const {users, costs, PasswordReset} = require("../db");
const { where } = require("sequelize-cockroachdb");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');


const router = new Router();
router.use(cors());
//Handle submitted form data
 
// POST calls
router.post('/signupsubmit', cors(), async function (req, res) {
    //Get our values submitted from the form
    var fromName = req.body.name;
    var fromUsername = req.body.username;
    var fromPassword = req.body.password;
    var fromEmail = req.body.email;
    var fromBudget = req.body.budget;

    const userExists = await users.findOne({where: {username: fromUsername, email: fromEmail}});
    if (userExists != null){
        console.log('repeated user');
        return res.sendStatus(204).end();
    }
  
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
        return res.sendStatus(200).end();
  });

  // Define the POST route to add a new record to the costs table
router.post('/costs', async (req, res) => {
    try {
      const { cost, typeofcost, location, email, numtimesbought } = req.body;
      // Create a new record in the costs table
      const newCost = await costs.create({
        cost: cost,
        typeofcost: typeofcost,
        location: location,
        email: email,
        numtimesbought: numtimesbought
      });
      res.status(201).json(newCost);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });



router.post('/forgot-password', async function(req, res) {
  const { email } = req.body;

  const user = await users.findOne({ where: { email } });
  if (!user) {
    // User with this email does not exist
    return res.sendStatus(404).end();
  }

  const token = crypto.randomBytes(20).toString('hex');
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'finupass@gmail.com',
      pass: 'afjdulifiidtbdmz',
    },
  });

  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

  const mailOptions = {
    from: '"financeU" <finupass@gmail.com>',
    to: email,
    subject: 'Reset your password',
    text: `To reset your password, click this link: ${resetUrl}`,
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      return res.sendStatus(500).end();
    } else {
      return res.sendStatus(200).end();
    }
  });
});

router.post('/reset-password', async function(req, res) {
    const { token, password } = req.body;
  
    const reset = await PasswordReset.findOne({ where: { token } });
    if (!reset || reset.expires < new Date()) {
      // Token is invalid or has expired
      return res.sendStatus(404).end();
    }
  
    const user = await users.findOne({ where: { email: reset.email } });
    if (!user) {
      // User with this email does not exist
      return res.sendStatus(404).end();
    }
  
    await user.update({ password });
  
    await reset.destroy();
  
    res.redirect('/login');
  });

// GET calls
router.get('/loginAuth', async function(req, res) {
    var fromUsername = req.body.username;
    var fromPassword = req.body.password;
    const userExists = await users.findOne({where: {username: fromUsername,password: fromPassword}});
    const userExists2 = await users.findOne({where: {email: fromUsername,password: fromPassword}});
    
    if (userExists != null || userExists2 != null){
        console.log('user exists');
        return res.sendStatus(200).end();
    }
    else{
        console.log('user does not exist');
        return res.sendStatus(404).end();
    }
});

router.get('/getPurchases', async function(req,res) {
    var fromEmail = req.body.email;
    const allPurchases = await costs.findAll({where: {email: fromEmail}});
    if (allPurchases.length == 0){
        return res.sendStatus(404).end();
    } else{
        const purchases = allPurchases.map(purchase => {
            const typeofcost = purchase.dataValues.typeofcost || 'misc';
            return {
                id: purchase.dataValues.id,
                cost: purchase.dataValues.cost,
                typeofcost: typeofcost,
                location: purchase.dataValues.location,
                numtimesbought: purchase.dataValues.numtimesbought
            };
        });
        return res.send(purchases);
    }
});

router.get('/reset-password/:token', async function(req, res) {
    const { token } = req.params;
  
    const reset = await PasswordReset.findOne({ where: { token } });
    if (!reset || reset.expires < new Date()) {
      // Token is invalid or has expired
      return res.sendStatus(404).end();
    }
  
    res.render('reset-password', { token });
  });
  

// HELPER FUNCTIONS

module.exports = router;
