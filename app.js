const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '64a965224849158cb9ecfb8a',
  };
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(404).json({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT);
