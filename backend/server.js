require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.on('open', () => console.log('Connected to Database'))

app.use(express.json())

const shoppingListRouter = require('./routes/shoppingList')
app.use('/shoppingList', shoppingListRouter)
const userRouter = require('./routes/user')
app.use('/user', userRouter)
const itemRouter = require('./routes/item')
app.use('/item', itemRouter)

app.listen(3001, () => console.log('Server Started'))