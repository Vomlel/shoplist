const express = require('express')
const router = express.Router()
const User = require('../models/user')
const ShoppingList = require('../models/shoppingList')

// get all
router.get('/', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (sessionId === undefined || sessionId === null) {
            res.status(500).json({ message: 'Missing session id.' })
        } else {
            let adminUser = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (adminUser === undefined ||  adminUser === null) {
                res.status(501).json('Session id is invalid.')
            } else if (adminUser.role !== 'admin') {
                res.status(502).json('Logged user is not an admin.')
            } else {
                const user = await User.find()
                res.status(200).json(user)
            }
        }
    } catch {
        res.status(400).json({ message: err.message })
    }
})
// get by id
router.get('/id/:id', async (req, res) => {
    try {
        let sessionId = req.headers['sessionid']
        if (sessionId === undefined || sessionId === null) {
            res.status(500).json({ message: 'Missing session id.' })
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (user === undefined ||  user === null) {
                res.status(501).json('Session id is invalid.')
            } else {
                const { id } = req.params
                const searchedUser = await User.findById(id)
                if (searchedUser === undefined ||  searchedUser === null) {
                    res.status(501).json('User id ' + id + ' does not exist.')
                } else if (user.role === 'admin') {
                    res.status(200).json(searchedUser)
                } else {
                    searchedUser.password = undefined
                    searchedUser.sessionId = undefined
                    searchedUser.sessionExpiration = undefined
                    searchedUser.__v = undefined
                    res.status(200).json(searchedUser)
                }
            }
        }
    } catch {
        res.status(400).json({ message: err.message })
    }
})
// create
router.post('/create', async (req, res) => {
    const user = new User({
        name: req.body.name,
        password:  req.body.password,
        role: "shopper",
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
        let id = req.params.id
        let sessionId = req.headers['sessionid']
        if (sessionId === undefined) {
            res.status(500).json('Missing session id. Please login.')
        } else {
            let userToDelete = await User.findById(id)
            if (userToDelete === null) {
                res.status(501).json('User id ' + id + ' does not exist')
            } else if (sessionId === userToDelete.sessionId && userToDelete.sessionExpiration > new Date()) {
                let shoppingLists = await ShoppingList.find({ ownerId: userToDelete.id })
                shoppingLists.forEach(shoppingList => {
                    shoppingList.delete()
                })
                shoppingLists = await ShoppingList.find({ usersId: userToDelete.id })
                shoppingLists.forEach(shoppingList => {
                    shoppingList.delete()
                })
                userToDelete.delete()
                res.status(202).json('User id ' + id + ' was deleted')
            } else {
                const loggedUser = await User.findOneAndUpdate({sessionId},
                    { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                    { new: true })
                if (loggedUser.role === 'admin') {
                    let shoppingLists = await ShoppingList.find({ ownerId: userToDelete.id })
                    shoppingLists.forEach(shoppingList => {
                        shoppingList.delete()
                    })
                    shoppingLists = await ShoppingList.find({ usersId: userToDelete.id })
                    shoppingLists.forEach(shoppingList => {
                        shoppingList.delete()
                    })
                    userToDelete.delete()
                    res.status(202).json('User id ' + id + ' was deleted')
                } else {
                    res.status(501).json('Session id is invalid or expired. Please login again.')
                }
            }
        }
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})
// login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { name: req.body.name, password: req.body.password },
            { $set: { sessionId: makeSessionId(), sessionExpiration: addMinutes(new Date(), 30) } },
            { new: true })
        if (user === undefined || user === null) {
            res.status(503).json('Incorrect name or password.')
        } else {
            user.password = undefined
            user.__v = undefined
            res.status(205).json(user)
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// logout
router.delete('/logout', async (req, res) => {
    try {
        let { sessionId } = req.headers['sessionid']
        if ({ sessionId } === undefined || { sessionId } === null) {
            res.status(500).json({ message: 'Missing session id.' })
        } else {
            let user = await User.findOneAndUpdate({ sessionId },
                { $set: { sessionId: undefined, sessionExpiration: undefined } },
                { new: true })
            if (user == undefined || user === null) {
                res.status(501).json('Session id is invalid.')
            } else {
                res.status(205).json('User id ' + user.id + ' was logged out.')
            }
        }
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})
// update role
router.put('/role/:role/id/:id', async (req, res) => {
    try {
        let id = req.params.id
        let role = req.params.role
        let {sessionId} = req.headers['sessionid']
        if (sessionId === undefined) {
            res.status(501).json('Missing session id')
        } else {
            let adminUser = await User.findOneAndUpdate({sessionId},
                { $set: { sessionExpiration: addMinutes(new Date(), 30) } },
                { new: true })
            if (adminUser === null || adminUser.role !== 'admin') {
                res.status(501).json('User id ' + adminUser.id + ' does not exist')
            } else {
                await User.findOneAndUpdate({id},
                    { $set: { role: role } },
                    { new: true })
                res.status(206).json('User id ' + id + ' role was updated to ' + role)
            }
        }
    } catch(err) {
        res.status(400).json({ message: err.message })
    }
})

function makeSessionId() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

module.exports = router