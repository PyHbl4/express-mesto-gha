const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.use((req, res) => {
  res.status(404).json({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT);
