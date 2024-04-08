const express = require('express');
const userRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}));
});

router.post('/signup', async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;

    const existingUser = await userRepo.getOneBy({email});
    if(existingUser){
        return res.send("Email is already in use!");
    }

    if(password !== passwordConfirmation){
        return res.send("Passwords must match!");
    }

    const newUser = await userRepo.create({email, password});
    req.session.userId = newUser.id;

    res.send("Account created!");
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send("You are logged out.");
})

router.get('/signin', (req, res) => {
  res.send(signinTemplate({req}));
});

router.post('/signin', async (req, res) => {
  const {email, password} = req.body;

  const user = await userRepo.getOneBy({email});

  if(!user){
    return res.send('User not found.');
  }

  const isValidPassword = await userRepo.comparePasswords(user.password, password);
  if(!isValidPassword){
    return res.send('Invalid password.');
  }

  req.session.userId = user.id;
  return res.send('You are signed in.');
});

module.exports = router;