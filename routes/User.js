const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const Admin=require('../models/Admin')
const Receptionist=require('../models/Receptionist')
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }

    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    User.create(userData)
                        .then(user => {
                            res.json({ status: user.email + 'Registered!' })
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })
            } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})
users.post('/addReceptionist', (req, res) => {
    const today = new Date()
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today
    }

    Receptionist.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    userData.password = hash
                    Receptionist.create(userData)
                        .then(user => {
                            res.json({ status: user.email + 'Registered!' })
                        })
                        .catch(err => {
                            res.send('error: ' + err)
                        })
                })
            } else {
                res.json({ error: 'User already exists' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

users.post('/login', (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    // Passwords match
                    const payload = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.send(token)
                } else {
                    // Passwords don't match
                    res.json({ error: 'User does not exist' })
                }
            } else {
                res.json({ error: 'User does not exist' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})
users.post('/admin', (req, res) => {
    Admin.findOne({
        email: req.body.email
    })
        .then(admin => {
            if (admin) {
                if (bcrypt.compareSync(req.body.password, admin.password)) {
                    // Passwords match
                    const payload = {
                        _id: admin._id,
                        first_name: admin.first_name,
                        last_name: admin.last_name,
                        email: admin.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.send(token)
                } else {
                    // Passwords don't match
                    res.json({ error: 'Admin does not exist' })
                }
            } else {
                res.json({ error: 'Admin does not exist' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})
users.post('/loginReceptionist', (req, res) => {
    Receptionist.findOne({
        email: req.body.email
    })
        .then(receptionist => {
            if (receptionist) {
                if (bcrypt.compareSync(req.body.password, receptionist.password)) {
                    // Passwords match
                    const payload = {
                        _id: receptionist._id,
                        first_name: receptionist.first_name,
                        last_name: receptionist.last_name,
                        email: receptionist.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.send(token)
                } else {
                    // Passwords don't match
                    res.json({ error: 'Admin does not exist' })
                }
            } else {
                res.json({ error: 'Admin does not exist' })
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})
users.get('/allUsers',(req,res)=>{
    User.find().exec().then(doc =>
    {
        console.log(doc)
        res.status(200).json(doc)
    })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                Error : err
            })})
})
users.get('/allReceptionist',(req,res)=>{
    Receptionist.find().exec().then(doc =>
    {
        console.log(doc)
        res.status(200).json(doc)
    })
        .catch(err => {
            console.log(err)
            res.status(400).json({
                Error : err
            })})
})

users.get('/profile', (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        _id: decoded._id
    })
        .then(user => {
            if (user) {
                res.json(user)
            } else {
                res.send('User does not exist')
            }
        })
        .catch(err => {
            res.send('error: ' + err)
        })
})

module.exports = users