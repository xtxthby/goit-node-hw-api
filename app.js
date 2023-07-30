// це наш вебсервер
const express = require('express')
// 'morgan--це спеціальний мідлеваре який виводить вконсоль 
// інформацію про запит це потрібно щоб дебажити код
const logger = require('morgan')
const cors = require('cors')
// імпортуємоз файла contacts де вказані шляхи
const contactsRouter = require('./routes/api/contacts')
// створюємо вебсервер
const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
// прописуємо міделваре
app.use(cors())
app.use(express.json())
// всі виклики які приходять на початковий 
// адрес перенаправляти на contactsRouter
app.use('/api/contacts', contactsRouter)
// відповідь на адресу якої немає
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})
// це едина функція з 4-мя параметрами для виведення помилок
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app
