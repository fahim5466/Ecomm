const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const userRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  keys: ['098qv8py1s4fjp9sg6i0[1hbk']
}));

app.get('/signup', (req, res) => {
    res.send(`
    <div>
    Your id is ${req.session.userId}
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `);
});

app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
  req.session = null;
  res.send("You are logged out.");
})

app.get('/signin', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `);
});

app.post('/signin', async (req, res) => {
  const {email, password} = req.body;

  const user = await userRepo.getOneBy({email});

  if(!user){
    return res.send('User not found.');
  }

  if(user.password !== password){
    return res.send('Invalid password.');
  }

  req.session.userId = user.id;
  return res.send('You are signed in.');
});

app.listen(3000, () => {
    console.log("Server is listening...");
});