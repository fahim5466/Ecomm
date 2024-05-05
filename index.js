const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  keys: ['098qv8py1s4fjp9sg6i0[1hbk']
}));
app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
    console.log("Server is listening...");
});