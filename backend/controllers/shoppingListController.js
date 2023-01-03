const User = require('../models/user')
const shoppingList = require('../models/shoppingList')
const express = require('express')
const ShoppingList = require('../models/shoppingList')

const shoppingListController = {
    getAll: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login.' })
            } else {
                let adminUser = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                    console.log(adminUser)
                if (adminUser == undefined || adminUser === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else if (adminUser.role !== 'admin') {
                    res.status(502).json('User hasn\'t admin role to do that.')
                } else {
                    const shoppingLists = await ShoppingList.find()
                    res.status(200).json(shoppingLists)
                }
            }
        } catch {
            res.status(400).json({ message: err.message })
        }
    },
    getAllMyOwned: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else {
                    let shoppingLists = await ShoppingList.find({ ownerId: user.id })
                    shoppingLists.forEach(shoppingList => {
                        shoppingList.ownerId = undefined
                        shoppingList.__v = undefined
                    })
                    res.status(200).json(shoppingLists)
                }
            }
        } catch {
            res.status(400).json({ message: err.message })
        }
    },
    getAllMyNotOwned: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else {
                    const shoppingLists = await ShoppingList.find({ usersId: user.id })
                    res.status(200).json(shoppingLists)
                }
            }
        } catch {
            res.status(400).json({ message: err.message })
        }
    },
    getOne: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else {
                    const shoppingList = await ShoppingList.findById(req.params.shoppingListId)
                    if (shoppingList == undefined || shoppingList === null) {
                        res.status(501).json('Shopping list id is invalid.')
                    } else if (shoppingList.ownerId === user.id || shoppingList.usersId.includes(user.id) || user.role === 'admin') {
                        res.status(200).json(shoppingList)
                    } else {
                        res.status(502).json('User id ' + user.id + 'is not owner or user of shopping list id ' + req.params.shoppingListId)
                    }
                }
            }
        } catch {
            res.status(400).json({ message: err.message })
        }
    },
    create: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login.' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
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
    },
    delete: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login.' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else {
                    const shoppingList = await ShoppingList.findById(req.params.shoppingListId)
                    if (shoppingList == undefined || shoppingList === null) {
                        res.status(501).json('Shopping list id is invalid.')
                    } else if (shoppingList.ownerId === user.id) {
                        shoppingList.delete()
                        res.status(202).json('Shopping list id ' + req.params.shoppingListId + ' was deleted')
                    } else if (user.role === 'admin') {
                        shoppingList.delete()
                        res.status(202).json('Shopping list id ' + req.params.shoppingListId + ' was deleted')
                    } else {
                        res.status(502).json('User id ' + user.id + 'is not owner of shopping list id ' + req.params.shoppingListId)
                    }
                }
            }
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
    addItem: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login.' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else {
                    const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
                    if (shoppingList == undefined || shoppingList === null) {
                        res.status(501).json('Shopping list id is invalid.')
                    } else if (shoppingList.ownerId === user.id || shoppingList.usersId.includes(user.id) || user.role === 'admin') {
                        let item = {name: req.body.name, quantity: req.body.quantity}
                        shoppingList.items.push(item)
                        shoppingList.save()
                        res.status(203).json(shoppingList)
                    } else {
                        res.status(502).json('User id ' + user.id + 'is not owner or user of shopping list id ' + req.params.shoppingListId)
                    }
                }
            }
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
    removeItem: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login.' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else {
                    const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
                    if (shoppingList == undefined || shoppingList === null) {
                        res.status(501).json('Shopping list id is invalid.')
                    } else if (shoppingList.ownerId === user.id || shoppingList.usersId.includes(user.id) || user.role === 'admin') {
                        if (req.body.itemId === undefined || req.body.itemId === null) {
                            res.status(500).json('Item id is missing in request.')
                        } else if (shoppingList.items.id(req.body.itemId) === undefined || shoppingList.items.id(req.body.itemId) === null) {
                            res.status(501).json('Item id is invalid.')
                        } else {
                            shoppingList.items.id(req.body.itemId).remove()
                            shoppingList.save()
                            console.log(shoppingList)
                            res.status(208).json(shoppingList)
                        }
                    } else {
                        res.status(502).json('User id ' + user.id + 'is not owner or user of shopping list id ' + req.params.shoppingListId)
                    }
                }
            }
        } catch (error) {
            res.status(400).json({ message: error.message })
        } 
    },
    addUser: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login.' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else {
                    const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
                    if (shoppingList == undefined || shoppingList === null) {
                        res.status(501).json('Shopping list id is invalid.')
                    } else if (shoppingList.ownerId === user.id || user.role === 'admin') {
                        const userToAdd = await User.findById(req.body.userId)
                        if (userToAdd == undefined || userToAdd === null) {
                            res.status(501).json('User id ' + req.body.userId + ' does not exist.')
                        } else {
                            if (shoppingList.usersId.includes(req.body.userId)) {
                                res.status(504).json('User id ' + req.body.userId + ' is already in shopping list id ' + shoppingList.id)
                            } else {
                                shoppingList.usersId.push(req.body.userId)
                                shoppingList.save()
                                res.status(203).json(shoppingList)
                            }
                        }
                    } else {
                        res.status(502).json('User id ' + user.id + 'is not owner of shopping list id ' + req.params.shoppingListId)
                    }
                }
            }
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },
    removeUser: async (req, res) => {
        try {
            let sessionId = req.headers['sessionid']
            if (!sessionId) {
                res.status(500).json({ message: 'Missing session id. Please login.' })
            } else {
                let user = await User.findOneAndUpdate({ sessionId },
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (user == undefined || user === null) {
                    res.status(501).json('Session id is invalid. Please login.')
                } else {
                    const shoppingList = await ShoppingList.findById(req.body.shoppingListId)
                    if (shoppingList == undefined || shoppingList === null) {
                        res.status(501).json('Shopping list id is invalid.')
                    } else if (shoppingList.ownerId === user.id || user.role === 'admin') {
                        const index = shoppingList.usersId.indexOf(req.body.userId)
                        shoppingList.usersId.splice(index, 1)
                        shoppingList.save()
                        res.status(208).json(shoppingList)
                    } else {
                        res.status(502).json('User id ' + user.id + 'is not owner of shopping list id ' + req.params.shoppingListId)
                    }
                }
            }
        } catch (error) {
            res.status(400).json({ message: error.message })
        } 
    }
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

module.exports = shoppingListController