const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/new');
const { checkProductTitle, checkProductPrice } = require('./validators');


const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
    res.send(createProductTemplate({}));
});

router.post('/admin/products/new',
    upload.single('image'),
    [checkProductTitle, checkProductPrice],
    async (req, res) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.send(createProductTemplate({errors}));
        }

        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });

        res.send('submitted');
})

module.exports = router;