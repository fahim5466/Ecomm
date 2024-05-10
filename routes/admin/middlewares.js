const { validationResult } = require('express-validator');

module.exports = {
    handleValidationErrors(templateFunc, getDataCallback){
        return async (req, res, next) => {
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                let data = {};

                if(getDataCallback){
                    data = await getDataCallback(req);
                }

                return res.send(templateFunc({errors, ...data}));
            }

            next();
        }
    },
    authenticateUser(req, res, next){
        if(!req.session.userId){
            return res.redirect('/signin');
        }

        next();
    }
};