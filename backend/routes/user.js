const express = require('express')
const router = express.Router()
const User = require('../models/user')
const validateUser = require('../Validators/userValidate')

// get all
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        for (let i = 0; i < users.length; i++) {
            users[i].password = undefined
            users[i].sessionId = undefined
            users[i].sessionExpiration = undefined
            users[i].__v = undefined
        }
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
        if (user !== null) {
            user.password = undefined
            user.sessionId = undefined
            user.sessionExpiration = undefined
            user.__v = undefined
        }
        res.json(user)
    } catch {
        res.status(500).json({ message: err.message })
    }
})
// create
router.post('/create', async (req, res) => {
    const user = new User({
        name: req.body.name,
        password:  req.body.password,
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
// login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { name: req.body.name, password: req.body.password },
            { $set: { sessionId: makeSessionId(), sessionExpiration: addMinutes(new Date(), 30) } },
            { new: true })
        if (user === null) {
            res.status(500).json('Incorrect name or password.')
        } else {
            user.password = undefined
            user.__v = undefined
            res.status(200).json(user)
        }
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
            res.status(501).json('Missing session id')
        } else {
            let user = await User.findById(id)
                if (user === null) {
                    res.status(500).json('User id ' + id + ' does not exist')
                } else if (sessionId === user.sessionId && user.sessionExpiration > new Date()) {
                    user.delete()
                    res.status(202).json('User id ' + id + ' was deleted')
                } else {
                    console.log(user)
                    console.log(sessionId)
                    res.status(502).json('Session id is invalid or expired. Please login again.')
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