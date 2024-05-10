const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/new');
const productIndexTemplate = require('../../views/admin/products/index');
const editProductTemplate = require('../../views/admin/products/edit');
const { checkProductTitle, checkProductPrice } = require('./validators');
const { handleValidationErrors, authenticateUser } = require('./middlewares');


const router = express.Router();
const upload = multer({storage: multer.memoryStorage()});

router.get('/admin/products',
    authenticateUser,
    async (req, res) => {
        const products = await productsRepo.getAll();
        res.send(productIndexTemplate({ products }));
});

router.get('/admin/products/new',
    authenticateUser,
    (req, res) => {
    res.send(createProductTemplate({}));
});

router.post('/admin/products/new',
    authenticateUser,
    upload.single('image'),
    [checkProductTitle, checkProductPrice],
    handleValidationErrors(createProductTemplate),
    async (req, res) => {
        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });

        res.redirect('/admin/products');
});

router.get('/admin/products/:id/edit',
    authenticateUser,
    async (req, res) => {
        const product = await productsRepo.getOne(req.params.id);

        if(!product){
            return res.send("Product not found!");
        }

        res.send(editProductTemplate({ product }));
    }
);

router.post('/admin/products/:id/edit',
    authenticateUser,
    upload.single('image'),
    [checkProductTitle, checkProductPrice],
    handleValidationErrors(editProductTemplate, async req => {
        const product = await productsRepo.getOne(req.params.id);
        return {product};
    }),
    async (req, res) => {
        const attrs = req.body;

        if(req.file){
            attrs.image = req.file.buffer.toString('base64');
        }

        try{
            await productsRepo.update(req.params.id, attrs);
        } catch(err){
            return res.send("Could not find product!");
        }

        res.redirect('/admin/products');
    }
);

router.post('/admin/products/:id/delete',
    authenticateUser,
    async (req, res) => {
        await productsRepo.delete(req.params.id);
        res.redirect('/admin/products');
    }
);

module.exports = router;