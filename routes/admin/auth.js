const express = require('express');

const userRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { checkEmailIsValid, checkPasswordIsValid, checkPasswordConfirmation, checkEmailExists, checkPasswordMatches } = require('./validators');
const { handleValidationErrors } = require('./middlewares');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({req}));
});

router.post('/signup',
  [checkEmailIsValid, checkPasswordIsValid, checkPasswordConfirmation],
  handleValidationErrors(signupTemplate),
  async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;

    const newUser = await userRepo.create({email, password});
    req.session.userId = newUser.id;

    res.redirect('/admin/products');
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
  handleValidationErrors(signinTemplate),
  async (req, res) => {
    const {email} = req.body;

    const user = await userRepo.getOneBy({email});
    req.session.userId = user.id;
    res.redirect('/admin/products');
  });

module.exports = router;