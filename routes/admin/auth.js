const express = require('express');
const userRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { validationResult } = require('express-validator');
const { checkEmailIsValid, checkPasswordIsValid, checkPasswordConfirmation, checkEmailExists, checkPasswordMatches } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}));
});

router.post('/signup', [checkEmailIsValid, checkPasswordIsValid, checkPasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.send(signupTemplate({req, errors}));
    }

    const {email, password, passwordConfirmation} = req.body;

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

router.post('/signin',
[checkEmailExists, checkPasswordMatches],
async (req, res) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
    return res.send(signinTemplate({req, errors}));
  }

  const {email} = req.body;

  const user = await userRepo.getOneBy({email});
  req.session.userId = user.id;
  return res.send('You are signed in.');
});

module.exports = router;