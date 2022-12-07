const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
const Item = require('../models/item')
const User = require('../models/user')

// get all
router.get('/', async (req, res) => {
    try {
        const item = await Item.find()
        res.status(200).json(item)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// get by id
router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params
        const item = await Item.findById(id)
        res.json(item)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// get by shopping list id
router.get('/shoppingListId/:shoppingListId', async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findById(req.params.shoppingListId)
        const itemsId = shoppingList.itemsId
        let items
        itemsId.forEach((itemId) => {
            items.push(Item.findById(itemId))
        })
        res.json(items)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// create
router.post('/create', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        amount: req.body.amount,
        unit: req.body.unit,
    })
    try {
        const newItem = await item.save()
        res.status(201).json(newItem)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// delete
router.delete('/delete/id/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        if (!item.$isEmpty && item.id !== req.params.id) 
            throw new Error('Item id ' + req.params.id + ' does not exist')
        item.delete()
        res.status(202).message('Item id ' + req.params.id + ' was deleted')
    } catch(err) {
        res.status(500).json({ message: err })
    }
})

module.exports = router