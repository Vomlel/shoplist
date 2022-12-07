const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
const Item = require('../models/item')
const User = require('../models/user')

// get all
router.get('/', async (req, res) => {
    try {
        const shoppingLists = await ShoppingList.find()
        res.json(shoppingLists)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// get all my (owner_id)
router.get('/ownerId/:ownerId', async (req, res) => {
    try {
        const { ownerId } = req.params
        const shoppingLists = await ShoppingList.find({ ownerId })
        res.json(shoppingLists)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// get all not my (user_id)
router.get('/userId/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const shoppingLists = await ShoppingList.find({ userId })
        res.json(shoppingLists)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// get one my (owner_id, shoppingList_id)
router.get('/ownerId/:ownerId/shoppingListId/:shoppingListId', async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findById(req.params.shoppingListId)
        if (!shoppingList.$isEmpty && shoppingList.ownerId !== req.params.ownerId) 
            throw new Error('User id ' + req.params.ownerId + 'is not owner of shopping list id ' + req.params.shoppingListId)
            res.json(shoppingList)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// get one not my (user_id, shoppingList_id)
router.get('/userId/:userId/shoppingListId/:shoppingListId', async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findById(req.params.shoppingListId)
        if (!shoppingList.$isEmpty && !shoppingList.usersId.includes(req.params.userId)) 
            throw new Error('User id ' + req.params.ownerId + 'is not a viewer of shopping list id ' + req.params.shoppingListId)
            res.json(shoppingList)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// create (owner_id, name)
router.post('/create', async (req, res) => {
    const shoppingList = new ShoppingList({
        name: req.body.name,
        ownerId: req.body.ownerId
    })
    try {
        const newShoppingList = await shoppingList.save()
        res.status(201).json(newShoppingList)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// delete (owner_id, shoppingList_id)
router.delete('/delete/ownerId/:ownerId/shoppingListId/:shoppingListId', async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findById(req.params.shoppingListId)
        if (!shoppingList.$isEmpty && shoppingList.ownerId !== req.params.ownerId) 
            throw new Error('User id ' + req.params.ownerId + 'is not owner of shopping list id ' + req.params.shoppingListId)
        shoppingList.delete()
        res.status(202).message('Shopping list id ' + req.params.shoppingListId + ' was deleted')
    } catch(err) {
        res.status(500).json({ message: err })
    }
})
// add item
router.patch('/addItem', async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
        if (!shoppingList.$isEmpty && shoppingList.ownerId !== req.body.ownerId) 
                throw new Error('User id ' + req.body.ownerId + 'is not owner of shopping list id ' + req.body.shoppingListId)
        shoppingList.itemsId.push(req.body.itemId)
        shoppingList.save()
        res.json(shoppingList)
    } catch {
        res.status(500).json({ message: err })
    }    
})
// remove item
router.patch('/removeItem/', async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
        if (!shoppingList.$isEmpty && shoppingList.ownerId !== req.body.ownerId) 
                throw new Error('User id ' + req.body.ownerId + 'is not owner of shopping list id ' + req.body.shoppingListId)
        const index = shoppingList.itemsId.indexOf(req.body.itemId)
        shoppingList.itemsId.splice(index, 1)
        shoppingList.save()
        res.json(shoppingList)
    } catch {
        res.status(500).json({ message: err })
    }    
})
// add user
router.patch('/addUser/', async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
        if (!shoppingList.$isEmpty && shoppingList.ownerId !== req.body.ownerId) 
                throw new Error('User id ' + req.body.ownerId + 'is not owner of shopping list id ' + req.body.shoppingListId)
        shoppingList.usersId.push(req.body.userId)
        shoppingList.save()
        res.json(shoppingList)
    } catch {
        res.status(500).json({ message: err })
    }    
})
// remove user
router.patch('/removeUser/', async (req, res) => {
    try {
        const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
        if (!shoppingList.$isEmpty && shoppingList.ownerId !== req.body.ownerId) 
                throw new Error('User id ' + req.body.ownerId + 'is not owner of shopping list id ' + req.body.shoppingListId)
        const index = shoppingList.itemsId.indexOf(req.body.userId)
        shoppingList.usersId.splice(index, 1)
        shoppingList.save()
        res.json(shoppingList)
    } catch {
        res.status(500).json({ message: err })
    }    
})

module.exports = router