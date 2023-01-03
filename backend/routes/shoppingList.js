const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
const User = require('../models/user')
const shoppingListController = require('../controllers/shoppingListController')

// get all (admin)
router.get('/', async (req, res) => {
    shoppingListController.getAll(req, res)
})
// get all my owned
router.get('/owned', async (req, res) => {
    shoppingListController.getAllMyOwned(req, res)
})
// get all my not owned
router.get('/notowned', async (req, res) => {
    shoppingListController.getAllMyNotOwned(req, res)
})
// get one
router.get('/shoppingListId/:shoppingListId', async (req, res) => {
    shoppingListController.getOne(req, res)
})
// create
router.post('/create', async (req, res) => {
    shoppingListController.create(req, res)
})
// delete shoppingList_id
router.delete('/shoppingListId/:shoppingListId', async (req, res) => {
    shoppingListController.delete(req, res)
})
// add item
router.patch('/addItem', async (req, res) => {
    shoppingListController.addItem(req, res)
})
// remove item
router.patch('/removeItem', async (req, res) => {
    shoppingListController.removeItem(req, res)
})
// add user
router.patch('/addUser', async (req, res) => {
    shoppingListController.addUser(req, res)
})
// remove user
router.patch('/removeUser', async (req, res) => {
    shoppingListController.removeUser(req, res)
})

module.exports = router