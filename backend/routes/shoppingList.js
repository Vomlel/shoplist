const express = require('express')
const router = express.Router()
const ShoppingList = require('../models/shoppingList')
const User = require('../models/user')

// get all (admin)
router.get('/', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id.' })
        } else {
            let adminUser = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (adminUser == undefined || adminUser === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else if (adminUser.role !== 'admin') {
                res.status(501).json('Logged user is not an admin.')
            } else {
                const shoppingLists = await ShoppingList.find()
                res.json(shoppingLists)
            }
        }
    } catch {
        res.status(400).json({ message: err.message })
    }
})
// get all my (owner_id)
router.get('/owned', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id.' })
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                let shoppingLists = await ShoppingList.find({ ownerId: user.id })
                shoppingLists.forEach(shoppingList => {
                    shoppingList.ownerId = undefined
                    shoppingList.__v = undefined
                })
                res.json(shoppingLists)
            }
        }
    } catch {
        res.status(400).json({ message: err.message })
    }
})
// get all not my (user_id)
router.get('/notowned', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id.' })
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                const shoppingLists = await ShoppingList.find({ usersId: user.id })
                res.json(shoppingLists)
            }
        }
    } catch {
        res.status(400).json({ message: err.message })
    }
})
// get one (owner_id, shoppingList_id)
router.get('/shoppingListId/:shoppingListId', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id.' })
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                const shoppingList = await ShoppingList.findById(req.params.shoppingListId)
                if (shoppingList == undefined || shoppingList === null) {
                    res.status(502).json('Shopping list id is invalid.')
                } else if (shoppingList.ownerId === user.id || shoppingList.usersId.includes(user.id)) {
                    res.status(200).json(shoppingList)
                } else {
                    res.status(503).json('User id ' + user.id + 'is not owner or user of shopping list id ' + req.params.shoppingListId)
                }
            }
        }
    } catch {
        res.status(400).json({ message: err.message })
    }
})
// create (owner_id, name)
router.post('/create', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id. Please login.' })
            res.redirect('/login')
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                const shoppingList = new ShoppingList({
                    name: req.body.name,
                    ownerId: user.id
                })
                    const newShoppingList = await shoppingList.save()
                    res.status(201).json(newShoppingList)
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// delete (owner_id, shoppingList_id)
router.delete('/shoppingListId/:shoppingListId', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id. Please login.' })
            res.redirect('/login')
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                const shoppingList = await ShoppingList.findById(req.params.shoppingListId)
                if (shoppingList == undefined || shoppingList === null) {
                    res.status(502).json('Shopping list id is invalid.')
                } else if (shoppingList.ownerId === user.id) {
                    shoppingList.delete()
                    res.status(202).json('Shopping list id ' + req.params.shoppingListId + ' was deleted')
                } else {
                    res.status(503).json('User id ' + user.id + 'is not owner of shopping list id ' + req.params.shoppingListId)
                }
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// add item
router.patch('/addItem', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id. Please login.' })
            res.redirect('/login')
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
                if (shoppingList == undefined || shoppingList === null) {
                    res.status(502).json('Shopping list id is invalid.')
                } else if (shoppingList.ownerId === user.id || shoppingList.usersId.includes(user.id)) {
                    let item = {name: req.body.name, quantity: req.body.quantity}
                    shoppingList.items.push(item)
                    shoppingList.save()
                    res.status(200).json(shoppingList)
                } else {
                    res.status(503).json('User id ' + user.id + 'is not owner or user of shopping list id ' + req.params.shoppingListId)
                }
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// remove item
router.patch('/removeItem', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id. Please login.' })
            res.redirect('/login')
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
                if (shoppingList == undefined || shoppingList === null) {
                    res.status(502).json('Shopping list id is invalid.')
                } else if (shoppingList.ownerId === user.id || shoppingList.usersId.includes(user.id)) {
                    if (req.body.itemId === undefined || req.body.itemId === null) {
                        res.status(504).json('Item id is missing in request.')
                    } else if (shoppingList.items.id(req.body.itemId) === undefined || shoppingList.items.id(req.body.itemId) === null) {
                        res.status(505).json('Item id is invalid.')
                    } else {
                        shoppingList.items.id(req.body.itemId).remove()
                        shoppingList.save()
                        res.status(200).json(shoppingList)
                    }
                } else {
                    res.status(503).json('User id ' + user.id + 'is not owner or user of shopping list id ' + req.params.shoppingListId)
                }
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    } 
})
// add user
router.patch('/addUser', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id. Please login.' })
            res.redirect('/login')
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
                if (shoppingList == undefined || shoppingList === null) {
                    res.status(502).json('Shopping list id is invalid.')
                } else if (shoppingList.ownerId === user.id) {
                    const userToAdd = await User.findById(req.body.userId)
                    if (userToAdd == undefined || userToAdd === null) {
                        res.status(506).json('User id ' + req.body.userId + ' does not exist.')
                    } else {
                        shoppingList.usersId.push(req.body.userId)
                        shoppingList.save()
                        res.status(200).json(shoppingList)
                    }
                } else {
                    res.status(503).json('User id ' + user.id + 'is not owner of shopping list id ' + req.params.shoppingListId)
                }
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// remove user
router.patch('/removeUser', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (!sessionId) {
            res.status(500).json({ message: 'Missing session id. Please login.' })
            res.redirect('/login')
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid. Please login.')
                res.redirect('/login')
            } else {
                const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
                if (shoppingList == undefined || shoppingList === null) {
                    res.status(502).json('Shopping list id is invalid.')
                } else if (shoppingList.ownerId === user.id) {
                    const index = shoppingList.usersId.indexOf(req.body.userId)
                    shoppingList.usersId.splice(index, 1)
                    shoppingList.save()
                    console.log(index)
                    res.status(202).json(shoppingList)
                } else {
                    res.status(503).json('User id ' + user.id + 'is not owner of shopping list id ' + req.params.shoppingListId)
                }
            }
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    } 
})

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

module.exports = router