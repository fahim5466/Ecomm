const { check } = require('express-validator');
const userRepo = require('../../repositories/users');

module.exports = {
    checkEmail:
    check('email').trim().normalizeEmail()
    .isEmail().withMessage("Must be a valid email!")
    .custom(async (email) => {
      const existingUser = await userRepo.getOneBy({email});
      if(existingUser){
          throw new Error("Email is already in use!");
      }else{
        return true;
      }
    }),
    checkPassword:
    check('password').trim()
    .isLength({min: 4, max: 20}).withMessage('Must be between 4 and 20 characters!'),
    checkPasswordConfirmation:
    check('passwordConfirmation').trim()
    .isLength({min: 4, max: 20}).withMessage('Must be between 4 and 20 characters!')
    .custom((passwordConfirmation, { req }) => {
        if(passwordConfirmation !== req.body.password){
            throw new Error('Passwords must match!');
        }else{
            return true;
        }
    })
};