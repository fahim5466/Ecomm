const express = require('express');
const userRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { validationResult } = require('express-validator');
const { checkEmail, checkPassword, checkPasswordConfirmation } = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}));
});

router.post('/signup', [checkEmail, checkPassword, checkPasswordConfirmation],
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
[
  check('email').trim().normalizeEmail()
  .isEmail().withMessage("Must be a valid email!")
  .custom(async (email) => {
    const user = await userRepo.getOneBy({email});
    if(!user){
      throw new Error('User not found!');
    }else{
      return true;
    }
  }),
  check('password').trim()
  .custom(async (password, {req}) => {
    const user = await userRepo.getOneBy({email: req.body.email});
    if(!user){
      throw new Error('Invalid password!');
    }

    const isValidPassword = await userRepo.comparePasswords(user.password, password);
    if(!isValidPassword){
      throw new Error('Invalid password!');
    }else{
      return true;
    }
  })
],
async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);

  const {email} = req.body;

  const user = await userRepo.getOneBy({email});
  req.session.userId = user.id;
  return res.send('You are signed in.');
});

module.exports = router;