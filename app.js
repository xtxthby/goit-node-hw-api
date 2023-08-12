const express = require('express');
// .це для виводу вконсоль
const logger = require('morgan');
const cors = require('cors');
// config() шукає текстові файли і додає 
// дані DB_HOST, PORT в змінні оточення  process.env
require("dotenv").config();
// імпортуємо роутер з ./routes/api/users
const authRouter = require("./routes/api/users");
const contactsRouter = require('./routes/api/contacts');

const app = express();
// тут в консоль виводимо записи
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
// міделвари
app.use(logger(formatsLogger));
// щоб обмежити доступ є налаштування для cors()
app.use(cors());
app.use(express.json());
// якщо прийде запит на статичний фаіл треба шукати в папці public
// якщо там немає то його неде немає
app.use(express.static("public"));
// вказуємо експресу усі запити на users оброби  authRouter
app.use("/api/users", authRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
});

module.exports = app;
