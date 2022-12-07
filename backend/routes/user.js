const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
const Item = require('../models/item')
const User = require('../models/user')

// get all
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// get by id
router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params
        // if (!!id) throw new Error('Owner id param is invalid.')
        const user = await User.findById(id)
        res.json(user)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// create
router.post('/create', async (req, res) => {
    const user = new User({
        name: req.body.name
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// delete
router.delete('/delete/id/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user.$isEmpty && user.id !== req.params.id) 
            throw new Error('User id ' + req.params.id + ' does not exist')
        user.delete()
        res.status(202).message('User id ' + req.params.id + ' was deleted')
    } catch(err) {
        res.status(500).json({ message: err })
    }
})

module.exports = router