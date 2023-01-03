const express = require('express')
const router = express.Router()
const User = require('../models/user')
const ShoppingList = require('../models/shoppingList')
const userController = require('../controllers/userController')

// get all
router.get('/', async (req, res) => {
    userController.getAll(req, res);
})
// get by id
router.get('/id/:id', async (req, res) => {
    userController.getById(req, res);
})
// create
router.post('/create', async (req, res) => {
    userController.create(req, res);
})
// delete
router.delete('/id/:id', async (req, res) => {
    userController.delete(req, res);
})
// login
router.post('/login', async (req, res) => {
    userController.login(req, res);
})
// logout
router.post('/logout', async (req, res) => {
    userController.logout(req, res);
})
// update role
router.put('/role/:role/id/:id', async (req, res) => {
    userController.updateRole(req, res);
})

module.exports = router