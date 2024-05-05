const { check } = require('express-validator');
const userRepo = require('../../repositories/users');

module.exports = {
    checkEmailIsValid:
    check('email').trim().normalizeEmail()
    .isEmail().withMessage("Must be a valid email!")
    .custom(async (email) => {
        const existingUser = await userRepo.getOneBy({email});
        if(existingUser){
            throw new Error("Email is already in use!");
        }

        return true;
    }),
    checkPasswordIsValid:
    check('password').trim()
    .isLength({min: 4, max: 20}).withMessage('Must be between 4 and 20 characters!'),
    checkPasswordConfirmation:
    check('passwordConfirmation').trim()
    .isLength({min: 4, max: 20}).withMessage('Must be between 4 and 20 characters!')
    .custom((passwordConfirmation, { req }) => {
        if(passwordConfirmation !== req.body.password){
            throw new Error('Passwords must match!');
        }
        
        return true;
    }),
    checkEmailExists:
    check('email').trim().normalizeEmail()
    .isEmail().withMessage("Must be a valid email!")
    .custom(async (email) => {
        const user = await userRepo.getOneBy({email});
        if(!user){
            throw new Error('User not found!');
        }
        
        return true;
    }),
    checkPasswordMatches:
    check('password').trim()
    .custom(async (password, {req}) => {
        const user = await userRepo.getOneBy({email: req.body.email});
        if(!user){
            throw new Error('Invalid password!');
        }

        const isValidPassword = await userRepo.comparePasswords(user.password, password);
        if(!isValidPassword){
            throw new Error('Invalid password!');
        }
        
        return true;
    }),
    checkProductTitle:
    check('title').trim()
    .isLength({min: 5, max: 40}).withMessage('Must be between 4 and 20 characters!'),
    checkProductPrice:
    check('price').trim()
    .toFloat().isFloat({min: 1}).withMessage('Must be a number greather than or equal to 1')
};